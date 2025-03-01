import { PrismaClient } from '@prisma/client';
import { GamificationService } from './gamificationService';

const prisma = new PrismaClient();

export class CourseService {
  private gamificationService: GamificationService;

  constructor() {
    this.gamificationService = new GamificationService();
  }

  async calculateCourseProgress(userId: string, courseId: string): Promise<number> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    const completedLessons = course.modules.reduce(
      (total, module) =>
        total +
        module.lessons.filter((lesson) => lesson.progress[0]?.completed).length,
      0
    );

    return (completedLessons / totalLessons) * 100;
  }

  async handleLessonCompletion(userId: string, courseId: string, lessonId: string): Promise<void> {
    // Update lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId,
        lessonId,
        completed: true,
      },
    });

    // Calculate and update course progress
    const progress = await this.calculateCourseProgress(userId, courseId);
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress,
      },
    });

    // Award points and check achievements
    await this.gamificationService.addPoints(userId, 10, 'Completed lesson');
    
    // Check for course completion
    if (progress === 100) {
      await this.handleCourseCompletion(userId, courseId);
    }
  }

  private async handleCourseCompletion(userId: string, courseId: string): Promise<void> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    // Award bonus points for course completion
    await this.gamificationService.addPoints(
      userId,
      50,
      `Completed course: ${course.title}`
    );

    // Check for achievements
    const completedCourses = await prisma.enrollment.count({
      where: {
        userId,
        progress: 100,
      },
    });

    // Achievement: Complete first course
    if (completedCourses === 1) {
      await this.gamificationService.unlockAchievement(userId, 'FIRST_COURSE');
    }

    // Achievement: Complete 5 courses
    if (completedCourses === 5) {
      await this.gamificationService.unlockAchievement(userId, 'COURSE_MASTER');
    }

    // Achievement: Complete course in specific category
    await this.checkCategoryAchievements(userId, course.category);
  }

  private async checkCategoryAchievements(
    userId: string,
    category: string
  ): Promise<void> {
    const completedInCategory = await prisma.enrollment.count({
      where: {
        userId,
        progress: 100,
        course: {
          category,
        },
      },
    });

    const achievementMap = {
      WEB_DEVELOPMENT: 'WEB_MASTER',
      FRONTEND: 'FRONTEND_MASTER',
      BACKEND: 'BACKEND_MASTER',
      MOBILE: 'MOBILE_MASTER',
      DEVOPS: 'DEVOPS_MASTER',
    };

    if (completedInCategory === 3 && achievementMap[category]) {
      await this.gamificationService.unlockAchievement(
        userId,
        achievementMap[category]
      );
    }
  }

  async getRecommendedCourses(userId: string): Promise<any[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get categories of completed courses
    const completedCategories = user.enrollments
      .filter((enrollment) => enrollment.progress === 100)
      .map((enrollment) => enrollment.course.category);

    // Get courses in similar categories that user hasn't enrolled in
    const recommendations = await prisma.course.findMany({
      where: {
        AND: [
          {
            category: {
              in: completedCategories,
            },
          },
          {
            NOT: {
              enrollments: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      include: {
        instructor: true,
      },
      take: 3,
    });

    return recommendations;
  }
}

export default new CourseService(); 