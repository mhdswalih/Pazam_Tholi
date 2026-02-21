import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Heart, MessageCircle, Send, Bookmark,
  MoreHorizontal, Smile, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface Post {
  id: number;
  user: string;
  avatar: string;
  location?: string;
  images: string[];
  likes: number;
  caption: string;
  comments: Comment[];
  time: string;
  liked: boolean;
  saved: boolean;
}

interface PostFeedProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Generate more dummy posts for infinite scroll
const generateDummyPosts = (startId: number, count: number): Post[] => {
  const users = [
    { name: 'arjun_kp', seed: 'arjun' },
    { name: 'meera_vk', seed: 'meera' },
    { name: 'sreehari_k', seed: 'sreehari' },
    { name: 'priya_m', seed: 'priya' },
    { name: 'rahul_nair', seed: 'rahul' },
    { name: 'devika_r', seed: 'devika' },
    { name: 'anand_t', seed: 'anand' },
    { name: 'jobin_p', seed: 'jobin' },
  ];

  const locations = [
    'Kozhikode Beach, Kerala',
    'SM Street, Kozhikode',
    'Calicut Heritage Walk',
    'Kappad Beach, Kozhikode',
    'Thusharagiri Falls',
    'Beypore, Kozhikode',
    'Mananchira Square',
    'Kadalundi Bird Sanctuary',
  ];

  const captions = [
    'Golden hour at Kozhikode 🌅 Nothing beats the Arabian Sea sunset. #Kerala #BeachVibes',
    'Found this beautiful antique chair at the heritage walk 🪑✨ #Heritage #Vintage',
    'Halwa, biryani, and chai from SM Street — the holy trinity of Kozhikode 🍛☕',
    'Perfect morning at the beach! 🌊 #MorningVibes #Kozhikode',
    'Exploring the hidden gems of Kozhikode 🗺️ #TravelKerala',
    'Food coma after the best biryani in town! 🍛 #Foodie #MalabarCuisine',
    'Sunset views that take your breath away 🌅 #NatureLover',
    'Weekend vibes with friends at the beach 🏖️ #WeekendMode',
  ];

  const images = [
    ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80'],
    [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
    ],
  ];

  const posts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const id = startId + i;
    const userIndex = id % users.length;
    const locationIndex = id % locations.length;
    const captionIndex = id % captions.length;
    const imagesIndex = id % images.length;
    const commentCount = (id % 5) + 1;

    const comments: Comment[] = [];
    for (let j = 0; j < commentCount; j++) {
      comments.push({
        id: j,
        user: `user_${j}`,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=commenter${j}`,
        text: `This is comment number ${j + 1}`,
        time: `${j + 1}h`,
      });
    }

    posts.push({
      id,
      user: users[userIndex].name,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${users[userIndex].seed}`,
      location: locations[locationIndex],
      images: images[imagesIndex],
      likes: Math.floor(Math.random() * 2000) + 500,
      caption: captions[captionIndex],
      comments,
      time: `${Math.floor(Math.random() * 10) + 1} hours ago`,
      liked: Math.random() > 0.7,
      saved: Math.random() > 0.8,
    });
  }

  return posts;
};

// Initial posts
const INITIAL_POSTS = generateDummyPosts(1, 5);

// ── Story Bubble ─────────────────────────────────────────────
const StoryBubble: React.FC<{ name: string; seed: string; darkMode: boolean; isOwn?: boolean }> = ({ name, seed, darkMode, isOwn }) => (
  <div className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
    <div className={`p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 group-hover:scale-105 transition-transform duration-200 ${isOwn ? 'opacity-60' : ''}`}>
      <div className={`p-[2px] rounded-full ${darkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <img
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
    </div>
    <span className={`text-xs font-medium truncate w-16 text-center ${darkMode ? 'text-gray-400' : 'text-amber-800'}`}>
      {isOwn ? 'Your story' : name}
    </span>
  </div>
);

// ── Post Card ─────────────────────────────────────────────────
const PostCard: React.FC<{ post: Post; darkMode: boolean; onUpdate: (post: Post) => void }> = ({ post, darkMode, onUpdate }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    onUpdate({ ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 });
  };

  const handleSave = () => onUpdate({ ...post, saved: !post.saved });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      user: 'you',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=you',
      text: newComment,
      time: 'now',
    };
    onUpdate({ ...post, comments: [...post.comments, comment] });
    setNewComment('');
  };

  const card = darkMode
    ? 'bg-gray-900 border-gray-800'
    : 'bg-white/80 backdrop-blur-sm border-amber-100';

  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const subtext = darkMode ? 'text-gray-400' : 'text-amber-700';
  const divider = darkMode ? 'border-gray-800' : 'border-amber-100';
  const inputBg = darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-500' : 'bg-amber-50 text-gray-900 placeholder-amber-400';

  return (
    <article className={`rounded-2xl border ${card} overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 mb-6`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400">
            <img src={post.avatar} alt={post.user} className={`w-9 h-9 rounded-full object-cover ${darkMode ? 'bg-gray-800' : 'bg-white'}`} />
          </div>
          <div>
            <p className={`font-semibold text-sm leading-tight ${text}`}>{post.user}</p>
            {post.location && <p className={`text-xs ${subtext}`}>{post.location}</p>}
          </div>
        </div>
        <button className={`p-1 rounded-full hover:bg-amber-100/20 transition-colors ${subtext}`}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image Carousel */}
      <div className="relative overflow-hidden bg-black aspect-square select-none">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${imgIdx * 100}%)`, width: `${post.images.length * 100}%` }}
        >
          {post.images.map((src, i) => (
            <img key={i} src={src} alt="" className="object-cover h-full" style={{ width: `${100 / post.images.length}%` }} />
          ))}
        </div>

        {/* Double tap heart */}
        <div className="absolute inset-0" onDoubleClick={handleLike} />

        {post.images.length > 1 && (
          <>
            {imgIdx > 0 && (
              <button onClick={() => setImgIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all">
                <ChevronLeft size={18} />
              </button>
            )}
            {imgIdx < post.images.length - 1 && (
              <button onClick={() => setImgIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-all">
                <ChevronRight size={18} />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, i) => (
                <div key={i} onClick={() => setImgIdx(i)} className={`rounded-full cursor-pointer transition-all duration-300 ${i === imgIdx ? 'bg-amber-400 w-4 h-1.5' : 'bg-white/60 w-1.5 h-1.5'}`} />
              ))}
            </div>
          </>
        )}

        {/* Like animation */}
        {likeAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="text-white fill-white drop-shadow-2xl animate-ping" size={80} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="group">
              <Heart
                size={26}
                className={`transition-all duration-300 ${post.liked
                  ? 'fill-red-500 text-red-500 scale-110'
                  : darkMode ? 'text-gray-300 hover:text-red-400 group-hover:scale-110' : 'text-gray-700 hover:text-red-400 group-hover:scale-110'
                }`}
              />
            </button>
            <button className={`hover:scale-110 transition-transform duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <MessageCircle size={26} />
            </button>
            <button className={`hover:scale-110 transition-transform duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Send size={24} />
            </button>
          </div>
          <button onClick={handleSave} className="group">
            <Bookmark
              size={26}
              className={`transition-all duration-300 ${post.saved
                ? 'fill-amber-400 text-amber-400 scale-110'
                : darkMode ? 'text-gray-300 hover:text-amber-400 group-hover:scale-110' : 'text-gray-700 hover:text-amber-500 group-hover:scale-110'
              }`}
            />
          </button>
        </div>

        {/* Likes */}
        <p className={`font-bold text-sm mb-1.5 ${text}`}>
          {post.likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <p className={`text-sm leading-relaxed mb-1 ${text}`}>
          <span className="font-semibold mr-1">{post.user}</span>
          {post.caption}
        </p>

        {/* Comments */}
        {post.comments.length > 1 && !showAllComments && (
          <button onClick={() => setShowAllComments(true)} className={`text-sm mb-1 ${subtext} hover:underline`}>
            View all {post.comments.length} comments
          </button>
        )}
        {(showAllComments ? post.comments : post.comments.slice(-1)).map(c => (
          <p key={c.id} className={`text-sm leading-relaxed ${text}`}>
            <span className="font-semibold mr-1">{c.user}</span>
            {c.text}
            <span className={`ml-2 text-xs ${subtext}`}>{c.time}</span>
          </p>
        ))}

        <p className={`text-xs mt-1 mb-2 ${subtext}`}>{post.time}</p>
      </div>

      {/* Divider */}
      <div className={`border-t ${divider} mx-4`} />

      {/* Comment input */}
      <form onSubmit={handleComment} className="flex items-center gap-3 px-4 py-2.5">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=you" alt="you" className="w-8 h-8 rounded-full" />
        <div className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 text-sm ${inputBg}`}>
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment…"
            className="bg-transparent flex-1 outline-none"
          />
          <Smile size={16} className={subtext} />
        </div>
        {newComment.trim() && (
          <button type="submit" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
            Post
          </button>
        )}
      </form>
    </article>
  );
};

// ── Main Feed ─────────────────────────────────────────────────
const PostFeed: React.FC<PostFeedProps> = ({ darkMode, setDarkMode }) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  // Simulate fetching more posts
  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPosts = generateDummyPosts(posts.length + 1, 3);
    
    // Stop after 30 posts for demo
    if (posts.length >= 30) {
      setHasMore(false);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
    }
    
    setLoading(false);
  }, [loading, hasMore, posts.length]);

  // Setup intersection observer
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchMorePosts();
      }
    }, {
      rootMargin: '100px', // Load more when within 100px of the bottom
    });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, fetchMorePosts]);

  const updatePost = (updated: Post) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const bg = darkMode
    ? 'bg-gray-950 text-gray-100'
    : 'bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 text-gray-900';

  const storyBg = darkMode
    ? 'bg-gray-900 border-gray-800'
    : 'bg-white/70 backdrop-blur-sm border-amber-100';

  const divider = darkMode ? 'border-gray-800' : 'border-amber-100';

  const STORIES = [
    { name: 'arjun_kp', seed: 'arjun' },
    { name: 'meera_vk', seed: 'meera' },
    { name: 'sreehari', seed: 'sreehari' },
    { name: 'priya_m', seed: 'priya' },
    { name: 'rahul_n', seed: 'rahul' },
    { name: 'devika_r', seed: 'devika' },
  ];

  return (
    <>
      
      {/* Main Content with Background */}
      <div className={`min-h-screen pb-12 px-4 ${bg} transition-colors duration-300`}>
      {/* Sticky Navbar - OUTSIDE the background div */}
      <div className="sticky top-0 z-50 w-full">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
        <div className="max-w-xl pt-6 mx-auto">

          {/* Stories Row */}
          <div className={`rounded-2xl border ${storyBg} shadow-sm mb-6 px-4 py-4`}>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              {/* Own story */}
              <StoryBubble name="Your story" seed="you" darkMode={darkMode} isOwn />
              {STORIES.map(s => (
                <StoryBubble key={s.seed} name={s.name} seed={s.seed} darkMode={darkMode} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${divider} mb-6`} />

          {/* Posts */}
          {posts.map((post, index) => {
            // Add ref to the last post for intersection observer
            if (index === posts.length - 1) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <PostCard post={post} darkMode={darkMode} onUpdate={updatePost} />
                </div>
              );
            } else {
              return <PostCard key={post.id} post={post} darkMode={darkMode} onUpdate={updatePost} />;
            }
          })}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${
                darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'
              } shadow-md`}>
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span className={darkMode ? 'text-gray-300' : 'text-amber-700'}>
                  Loading more posts...
                </span>
              </div>
            </div>
          )}

          {/* End of feed message */}
          {!hasMore && !loading && posts.length > 0 && (
            <div className="text-center py-8">
              <p className={darkMode ? 'text-gray-400' : 'text-amber-600'}>
                You've reached the end! 🎉
              </p>
            </div>
          )}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </>
  );
};

export default PostFeed;