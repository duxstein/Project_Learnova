import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubePlaylist {
  id: {
    playlistId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
  };
  contentDetails?: {
    itemCount: number;
  };
  statistics?: {
    viewCount: string;
  };
}

interface PlaylistItem {
  snippet: {
    title: string;
    description: string;
    position: number;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
}

interface LearningRoadmap {
  playlistId: string;
  playlistTitle: string;
  channelTitle: string;
  totalVideos: number;
  videos: {
    title: string;
    description: string;
    videoId: string;
    position: number;
    thumbnail: string;
  }[];
}

export const youtubeService = {
  async searchCoursePlaylists(query: string): Promise<YouTubePlaylist[]> {
    try {
      // Validate API key
      if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key is not configured');
      }

      // First, search for playlists with error handling
      const searchResponse = await axios.get(`${YOUTUBE_API_URL}/search`, {
        params: {
          part: 'snippet',
          q: `${query} tutorial course complete playlist`,
          type: 'playlist',
          maxResults: 5,
          order: 'relevance',
          key: YOUTUBE_API_KEY,
        },
      }).catch(error => {
        console.error('YouTube API search error:', error.response?.data || error.message);
        throw new Error('Failed to search YouTube playlists');
      });

      if (!searchResponse.data.items?.length) {
        console.log('No playlists found for query:', query);
        return [];
      }

      // Get playlist IDs
      const playlistIds = searchResponse.data.items.map((item: YouTubePlaylist) => item.id.playlistId);

      // Get playlist details including statistics and content details
      const playlistsResponse = await axios.get(`${YOUTUBE_API_URL}/playlists`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: playlistIds.join(','),
          key: YOUTUBE_API_KEY,
        },
      }).catch(error => {
        console.error('YouTube API playlists error:', error.response?.data || error.message);
        throw new Error('Failed to fetch playlist details');
      });

      if (!playlistsResponse.data.items?.length) {
        console.log('No playlist details found');
        return [];
      }

      // Sort playlists by view count and number of videos
      return playlistsResponse.data.items.sort((a: YouTubePlaylist, b: YouTubePlaylist) => {
        const aScore = parseInt(a.statistics?.viewCount || '0') * 0.7 + 
                      parseInt(a.contentDetails?.itemCount || '0') * 0.3;
        const bScore = parseInt(b.statistics?.viewCount || '0') * 0.7 + 
                      parseInt(b.contentDetails?.itemCount || '0') * 0.3;
        return bScore - aScore;
      });
    } catch (error) {
      console.error('Error in searchCoursePlaylists:', error);
      return [];
    }
  },

  async getPlaylistVideos(playlistId: string): Promise<LearningRoadmap | null> {
    try {
      if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key is not configured');
      }

      // Get playlist details
      const playlistResponse = await axios.get(`${YOUTUBE_API_URL}/playlists`, {
        params: {
          part: 'snippet,contentDetails',
          id: playlistId,
          key: YOUTUBE_API_KEY,
        },
      }).catch(error => {
        console.error('YouTube API playlist error:', error.response?.data || error.message);
        throw new Error('Failed to fetch playlist');
      });

      if (!playlistResponse.data.items?.[0]) {
        console.log('No playlist found for ID:', playlistId);
        return null;
      }

      const playlist = playlistResponse.data.items[0];

      // Get all videos in the playlist
      const videosResponse = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 50,
          key: YOUTUBE_API_KEY,
        },
      }).catch(error => {
        console.error('YouTube API playlist items error:', error.response?.data || error.message);
        throw new Error('Failed to fetch playlist videos');
      });

      if (!videosResponse.data.items?.length) {
        console.log('No videos found in playlist');
        return null;
      }

      // Transform video data
      const videos = videosResponse.data.items
        .filter((item: PlaylistItem) => item.snippet && item.snippet.resourceId)
        .map((item: PlaylistItem) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          videoId: item.snippet.resourceId.videoId,
          position: item.snippet.position,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        }));

      // Create learning roadmap
      return {
        playlistId,
        playlistTitle: playlist.snippet.title,
        channelTitle: playlist.snippet.channelTitle,
        totalVideos: playlist.contentDetails.itemCount,
        videos: videos.sort((a, b) => a.position - b.position),
      };
    } catch (error) {
      console.error('Error in getPlaylistVideos:', error);
      return null;
    }
  },

  async createLearningRoadmap(query: string): Promise<LearningRoadmap | null> {
    try {
      // Find the best playlist
      const playlists = await this.searchCoursePlaylists(query);
      if (playlists.length === 0) {
        console.log('No playlists found for query:', query);
        return null;
      }

      // Get the complete roadmap for the best playlist
      const bestPlaylist = playlists[0];
      return await this.getPlaylistVideos(bestPlaylist.id.playlistId);
    } catch (error) {
      console.error('Error in createLearningRoadmap:', error);
      return null;
    }
  },
}; 