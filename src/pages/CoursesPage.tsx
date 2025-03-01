import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '../components/Course/CourseCard';
import courseApi from '../api/courseApi';
import { Course } from '../types/course';

const categories = ['All', 'Web Development', 'Frontend', 'Backend', 'Mobile', 'DevOps'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, selectedCategory, selectedLevel, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory.toUpperCase().replace(' ', '_') : undefined,
        level: selectedLevel !== 'All' ? selectedLevel.toUpperCase() : undefined,
        page,
        limit: 9,
      };

      const response = await courseApi.getCourses(params);
      setCourses(response.courses);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="text-center py-4 text-red-600">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses.map(course => (
                <CourseCard key={course.id} {...course} />
              ))}
            </motion.div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600">No courses found matching your criteria</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage; 