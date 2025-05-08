import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import {
    FaListAlt,
    FaUserFriends,
    FaImage,
    FaThumbsUp,
    FaClock,
    FaStar,
    FaBell,
    FaQuestionCircle,
    FaUserPlus,
    FaSignInAlt,
    FaLock,
    FaRegFileAlt,
    FaVideo
} from "react-icons/fa";
import NavBar from '../NavBar/NavBar';
import SideBar from '../SideBar/SideBar';
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Welcome to SkillHub Online Learning Platform! 🎓 How can I assist you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
      quickReplies: [
        "How to register",
        "How to login",
        "Security features",
        "Platform purpose",
        "Create learning plan",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Knowledge base with responses for SkillHub platform
  const botResponses = {
    greetings: [
      "Hello! 👋 Welcome to SkillHub. How can I assist you today?",
      "Hi there! Ready to learn something new? 📚 How can I help?",
      "Welcome to SkillHub! We're excited to support your learning journey. What would you like to know?",
    ],
    register: {
      response: "To register with SkillHub:",
      steps: [
        "1. Visit SkillsHub website and click on 'Sign Up'button",
        "2. Choose your account type (Learner/Instructor)",
        "3. Fill in your details (name, email, password)",
        "4. Verify your email address",
        "5. Complete your profile setup",
      ],
      followUp: "Would you like the direct registration link?",
      note: "Registration is free and takes less than 2 minutes!",
    },
    login: {
      response: "To login to SkillHub:",
      steps: [
        "1. Go to SkillsHub website or open the mobile app",
        "2. Click 'Login' at the top right",
        "3. Enter your registered email and password",
        "4. Click 'Sign In' or press Enter",
      ],
      followUp: "Need help with password recovery?",
      options: [
        "You can also login using Google or Facebook accounts",
        "Two-factor authentication is available for extra security",
      ],
    },
    security: {
      response: "SkillsHub provides these security features:",
      features: [
        "🔒 End-to-end encryption for all data",
        "🛡️ Two-factor authentication option",
        "📧 Email verification for new accounts",
        "👁️ Regular security audits",
        "🚫 Automatic logout after 30 minutes of inactivity",
        "🔐 Password strength requirements",
        "📱 Device management to monitor active sessions",
      ],
      followUp: "Would you like to enable additional security features?",
      note: "We never store your payment details directly on our servers",
    },
    purpose: {
      response: "The main purpose of SkillsHub is:",
      points: [
        "🌟 To provide a collaborative online learning environment",
        "📚 Offer diverse courses and learning materials",
        "🤝 Connect learners with expert instructors",
        "📈 Help users track and improve their skills",
        "🌍 Make quality education accessible worldwide",
        "💡 Foster knowledge sharing through community features",
      ],
      followUp: "Would you like to know about our special features?",
      vision: "Our vision is to democratize education through technology",
    },
    learningPlan: {
      response: "To create a learning progress plan:",
      steps: [
        "1. Go to 'My Learning' in your dashboard",
        "2. Click 'Create New Plan'",
        "3. Select your skill areas of interest",
        "4. Set your weekly learning goals",
        "5. Choose your preferred learning style",
        "6. Save and track your progress",
      ],
      followUp: "Would you like suggestions for your learning plan?",
      tips: [
        "Start with 2-3 hours per week and adjust as needed",
        "Mix different types of content (videos, readings, quizzes)",
        "Set milestone goals to stay motivated",
      ],
    },
    categories: {
      response: "SkillsHub provides these category plans:",
      types: [
        "📊 Professional Development",
        "💻 Technology & Programming",
        "🎨 Creative Arts",
        "🌐 Languages",
        "🧠 Personal Growth",
        "🏢 Business & Management",
        "⚕️ Health & Wellness",
        "🔧 Trade Skills",
      ],
      followUp: "Would you like to explore a specific category?",
      note: "Each category has multiple subcategories for focused learning",
    },
    publishPost: {
      response: "To publish a post on SkillsHub:",
      steps: [
        "1. Go to the 'Community' section",
        "2. Click 'Create Post'",
        "3. Write your content (minimum 50 characters)",
        "4. Add relevant tags",
        "5. Choose visibility (Public/Followers Only)",
        "6. Click 'Publish'",
      ],
      followUp: "Would you like to know about post guidelines?",
      rules: [
        "Posts must be relevant to learning",
        "No promotional content without approval",
        "Respect all community members",
      ],
    },
    publishVideo: {
      response: "To publish a video post:",
      steps: [
        "1. Follow regular post creation steps",
        "2. Click the video icon to upload",
        "3. Select your video file (max 3 minutes)",
        "4. Add a title and description",
        "5. Choose thumbnail image",
        "6. Click 'Publish'",
      ],
      followUp: "Would you like video content tips?",
      specs: [
        "Maximum length: 3 minutes",
        "Supported formats: MP4, MOV, AVI",
        "Maximum file size: 500MB",
        "HD quality recommended",
      ],
    },
    postImages: {
      response: "Image limits for posts:",
      details: [
        "You can add up to 5 images per post",
        "Supported formats: JPG, PNG, GIF",
        "Maximum file size per image: 10MB",
        "Recommended resolution: 1200x800px",
        "Images are automatically optimized",
      ],
      followUp: "Need help with image editing?",
      tips: [
        "Use clear, high-quality images",
        "Add captions for better context",
        "Use alt text for accessibility",
      ],
    },
    videoLength: {
      response: "Video post specifications:",
      details: [
        "Maximum length: 10 minutes",
        "Minimum length: 30 seconds",
        "Recommended aspect ratio: 16:9",
        "Supported resolutions: up to 1080p",
        "Audio quality should be clear",
      ],
      followUp: "Would you like tips for creating educational videos?",
      note: "Longer videos can be broken into parts and posted as a series",
    },
    followUsers: {
      response: "About following users:",
      details: [
        "✅ Yes, you can follow other users",
        "🔔 Get notifications when they post",
        "👥 See their posts in your feed",
        "📈 Discover popular educators",
        "🔒 You can make your profile private",
      ],
      followUp: "Would you like to manage your followers?",
      note: "Following helps build your learning network",
    },
    engagement: {
      response: "Post engagement features:",
      features: [
        "👍 Like posts to show appreciation",
        "💬 Comment to discuss or ask questions",
        "↗️ Share posts with your network",
        "🔖 Bookmark posts to save for later",
        "🏷️ Tag users in comments",
        "📊 See view counts on your posts",
      ],
      followUp: "Would you like engagement tips?",
      guidelines: [
        "Keep comments constructive",
        "Respect different opinions",
        "Give credit when sharing others' content",
      ],
    },
    availability: {
      response: "System availability:",
      details: [
        "🕒 24/7 access to learning materials",
        "⏰ Live sessions scheduled by instructors",
        "🛠️ Maintenance windows: 2am-4am UTC Sundays",
        "📱 Mobile app always available",
        "🌍 Accessible worldwide",
      ],
      followUp: "Need to know about scheduled maintenance?",
      note: "We provide 30-day advance notice for major updates",
    },
    additionalFeatures: {
      response: "Additional features to improve knowledge:",
      features: [
        "📝 Interactive quizzes and assessments",
        "🎓 Skill certification programs",
        "🤝 Peer learning groups",
        "📅 Personalized learning reminders",
        "📊 Progress tracking dashboard",
        "🎧 Podcast-style audio lessons",
        "📚 Downloadable resources",
        "💡 Expert Q&A sessions",
      ],
      followUp: "Would you like details about any specific feature?",
      note: "New features added monthly based on user feedback",
    },
    notifications: {
      response: "Notification schedule:",
      times: [
        "⏰ Daily learning reminders (customizable)",
        "📅 Upcoming course deadlines (24h before)",
        "💬 Responses to your posts (immediate)",
        "👥 New followers (immediate)",
        "🎓 Course recommendations (weekly)",
        "📢 System announcements (as needed)",
      ],
      followUp: "Would you like to customize your notification settings?",
      note: "You can fully control notification types and frequency",
    },
    default: [
      "I'm not sure I understand. Could you rephrase your question?",
      "Hmm, I didn't catch that. Could you ask about registration, login, or other platform features?",
      "I'm still learning! Could you ask about SkillHub's features or learning tools?",
    ],
  };

  // Keyword mapping for SkillHub specific questions
  const keywordMap = {
    greetings: ["hi", "hello", "hey", "good morning", "good afternoon"],
    register: ["register", "sign up", "create account", "join", "new account"],
    login: ["login", "sign in", "log in", "access account"],
    security: ["security", "privacy", "safe", "protection", "encryption"],
    purpose: ["purpose", "about", "what is", "mission", "vision"],
    learningPlan: [
      "learning plan",
      "progress plan",
      "study plan",
      "skill plan",
    ],
    categories: ["categories", "types", "plans", "offerings", "topics"],
    publishPost: ["publish post", "create post", "write post", "make post"],
    publishVideo: [
      "video post",
      "publish video",
      "upload video",
      "share video",
    ],
    postImages: ["pictures", "images", "photos", "image limit"],
    videoLength: [
      "video length",
      "how long video",
      "video duration",
      "time limit",
    ],
    followUsers: ["follow", "following", "track users", "subscribe"],
    engagement: ["like", "comment", "share", "engage", "interact"],
    availability: ["available", "when open", "access", "downtime", "up time"],
    additionalFeatures: ["features", "tools", "options", "functionality"],
    notifications: ["notifications", "alerts", "reminders", "messages"],
  };

  // Handle user input
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSuggestions([]);
    setIsTyping(true);

    // Process after a short delay
    setTimeout(() => {
      const botMessage = generateBotResponse(inputValue.toLowerCase());
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }, 800 + Math.random() * 700);
  };

  // Generate bot responses for SkillHub
  const generateBotResponse = (userInput) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check for greetings
    if (keywordMap.greetings.some((word) => userInput.includes(word))) {
      const randomGreeting =
        botResponses.greetings[
          Math.floor(Math.random() * botResponses.greetings.length)
        ];
      return {
        text: randomGreeting,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "How to register",
          "How to login",
          "Security features",
          "Platform purpose",
          "Create learning plan",
        ],
      };
    }

    // Check for registration questions
    if (keywordMap.register.some((word) => userInput.includes(word))) {
      const steps = botResponses.register.steps.join("\n");
      let responseText = `${botResponses.register.response}\n${steps}`;

      if (userInput.includes("link") || userInput.includes("url")) {
        responseText += `\n\nRegistration page: https://skillhub.com/register`;
      } else {
        responseText += `\n\n${botResponses.register.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Registration link",
          "Account types",
          "Profile setup",
          "Verification process",
          "Login help",
        ],
      };
    }

    // Check for login questions
    if (keywordMap.login.some((word) => userInput.includes(word))) {
      const steps = botResponses.login.steps.join("\n");
      let responseText = `${botResponses.login.response}\n${steps}`;

      if (
        userInput.includes("forgot") ||
        userInput.includes("recover") ||
        userInput.includes("reset")
      ) {
        responseText += `\n\nPassword recovery: https://skillhub.com/reset-password`;
      } else {
        responseText += `\n\n${botResponses.login.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Password recovery",
          "Two-factor auth",
          "Social login",
          "Troubleshooting",
          "Security features",
        ],
      };
    }

    // Check for security questions
    if (keywordMap.security.some((word) => userInput.includes(word))) {
      const features = botResponses.security.features.join("\n");
      let responseText = `${botResponses.security.response}\n${features}`;

      if (
        userInput.includes("enable") ||
        userInput.includes("turn on") ||
        userInput.includes("activate")
      ) {
        responseText += `\n\nGo to Account Settings > Security to enable additional features`;
      } else {
        responseText += `\n\n${botResponses.security.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Enable 2FA",
          "Device management",
          "Privacy settings",
          "Data encryption",
          "Password tips",
        ],
      };
    }

    // Check for purpose questions
    if (keywordMap.purpose.some((word) => userInput.includes(word))) {
      const points = botResponses.purpose.points.join("\n");
      let responseText = `${botResponses.purpose.response}\n${points}`;

      if (
        userInput.includes("feature") ||
        userInput.includes("special") ||
        userInput.includes("unique")
      ) {
        responseText += `\n\nUnique features: Interactive learning paths, skill certification, peer mentoring, and AI-powered recommendations`;
      } else {
        responseText += `\n\n${botResponses.purpose.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Unique features",
          "Learning methods",
          "Community aspects",
          "Certification",
          "Accessibility",
        ],
      };
    }

    // Check for learning plan questions
    if (keywordMap.learningPlan.some((word) => userInput.includes(word))) {
      const steps = botResponses.learningPlan.steps.join("\n");
      let responseText = `${botResponses.learningPlan.response}\n${steps}`;

      if (
        userInput.includes("suggest") ||
        userInput.includes("recommend") ||
        userInput.includes("example")
      ) {
        const tips = botResponses.learningPlan.tips.join("\n");
        responseText += `\n\nSuggestions:\n${tips}`;
      } else {
        responseText += `\n\n${botResponses.learningPlan.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Plan suggestions",
          "Skill assessment",
          "Goal setting",
          "Progress tracking",
          "Time management",
        ],
      };
    }

    // Check for category questions
    if (keywordMap.categories.some((word) => userInput.includes(word))) {
      const types = botResponses.categories.types.join("\n");
      let responseText = `${botResponses.categories.response}\n${types}`;

      if (
        userInput.includes("explore") ||
        userInput.includes("browse") ||
        userInput.includes("view")
      ) {
        responseText += `\n\nBrowse categories: https://skillhub.com/categories`;
      } else {
        responseText += `\n\n${botResponses.categories.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Professional Development",
          "Technology",
          "Creative Arts",
          "Languages",
          "Business",
        ],
      };
    }

    // Check for post publishing questions
    if (keywordMap.publishPost.some((word) => userInput.includes(word))) {
      const steps = botResponses.publishPost.steps.join("\n");
      let responseText = `${botResponses.publishPost.response}\n${steps}`;

      if (
        userInput.includes("guideline") ||
        userInput.includes("rule") ||
        userInput.includes("policy")
      ) {
        const rules = botResponses.publishPost.rules.join("\n");
        responseText += `\n\nCommunity guidelines:\n${rules}`;
      } else {
        responseText += `\n\n${botResponses.publishPost.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Post guidelines",
          "Image limits",
          "Video posts",
          "Tagging",
          "Community rules",
        ],
      };
    }

    // Check for video post questions
    if (keywordMap.publishVideo.some((word) => userInput.includes(word))) {
      const steps = botResponses.publishVideo.steps.join("\n");
      let responseText = `${botResponses.publishVideo.response}\n${steps}`;

      if (
        userInput.includes("tip") ||
        userInput.includes("advice") ||
        userInput.includes("suggest")
      ) {
        const specs = botResponses.publishVideo.specs.join("\n");
        responseText += `\n\nVideo specs:\n${specs}`;
      } else {
        responseText += `\n\n${botResponses.publishVideo.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Video specs",
          "Editing tips",
          "Length limits",
          "Formats",
          "Thumbnails",
        ],
      };
    }

    // Check for image post questions
    if (keywordMap.postImages.some((word) => userInput.includes(word))) {
      const details = botResponses.postImages.details.join("\n");
      let responseText = `${botResponses.postImages.response}\n${details}`;

      if (
        userInput.includes("edit") ||
        userInput.includes("adjust") ||
        userInput.includes("change")
      ) {
        const tips = botResponses.postImages.tips.join("\n");
        responseText += `\n\nImage tips:\n${tips}`;
      } else {
        responseText += `\n\n${botResponses.postImages.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Image editing",
          "File formats",
          "Size limits",
          "Accessibility",
          "Post creation",
        ],
      };
    }

    // Check for video length questions
    if (keywordMap.videoLength.some((word) => userInput.includes(word))) {
      const details = botResponses.videoLength.details.join("\n");
      let responseText = `${botResponses.videoLength.response}\n${details}`;

      if (
        userInput.includes("educational") ||
        userInput.includes("effective") ||
        userInput.includes("make")
      ) {
        responseText += `\n\nVideo tips: Keep videos focused (3-7 min ideal), use clear visuals, add captions, and include summary points`;
      } else {
        responseText += `\n\n${botResponses.videoLength.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Video tips",
          "Editing tools",
          "Audio quality",
          "Aspect ratio",
          "Upload process",
        ],
      };
    }

    // Check for follow user questions
    if (keywordMap.followUsers.some((word) => userInput.includes(word))) {
      const details = botResponses.followUsers.details.join("\n");
      let responseText = `${botResponses.followUsers.response}\n${details}`;

      if (
        userInput.includes("manage") ||
        userInput.includes("control") ||
        userInput.includes("setting")
      ) {
        responseText += `\n\nManage followers: Profile Settings > Privacy > Follower Settings`;
      } else {
        responseText += `\n\n${botResponses.followUsers.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Follower settings",
          "Privacy options",
          "Notifications",
          "Find users",
          "Network building",
        ],
      };
    }

    // Check for engagement questions
    if (keywordMap.engagement.some((word) => userInput.includes(word))) {
      const features = botResponses.engagement.features.join("\n");
      let responseText = `${botResponses.engagement.response}\n${features}`;

      if (
        userInput.includes("tip") ||
        userInput.includes("guide") ||
        userInput.includes("effective")
      ) {
        const guidelines = botResponses.engagement.guidelines.join("\n");
        responseText += `\n\nEngagement guidelines:\n${guidelines}`;
      } else {
        responseText += `\n\n${botResponses.engagement.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Commenting",
          "Sharing",
          "Bookmarking",
          "Community rules",
          "Networking",
        ],
      };
    }

    // Check for availability questions
    if (keywordMap.availability.some((word) => userInput.includes(word))) {
      const details = botResponses.availability.details.join("\n");
      let responseText = `${botResponses.availability.response}\n${details}`;

      if (
        userInput.includes("maintenance") ||
        userInput.includes("update") ||
        userInput.includes("down")
      ) {
        responseText += `\n\nNext maintenance window: Coming Sunday 2am-4am UTC`;
      } else {
        responseText += `\n\n${botResponses.availability.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Maintenance schedule",
          "Mobile access",
          "Live sessions",
          "Time zones",
          "Offline content",
        ],
      };
    }

    // Check for additional features questions
    if (
      keywordMap.additionalFeatures.some((word) => userInput.includes(word))
    ) {
      const features = botResponses.additionalFeatures.features.join("\n");
      let responseText = `${botResponses.additionalFeatures.response}\n${features}`;

      if (
        userInput.includes("detail") ||
        userInput.includes("specific") ||
        userInput.includes("explain")
      ) {
        responseText += `\n\nWhich feature would you like more details about?`;
      } else {
        responseText += `\n\n${botResponses.additionalFeatures.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Skill certification",
          "Peer groups",
          "Progress tracking",
          "Audio lessons",
          "Expert Q&A",
        ],
      };
    }

    // Check for notification questions
    if (keywordMap.notifications.some((word) => userInput.includes(word))) {
      const times = botResponses.notifications.times.join("\n");
      let responseText = `${botResponses.notifications.response}\n${times}`;

      if (
        userInput.includes("custom") ||
        userInput.includes("change") ||
        userInput.includes("setting")
      ) {
        responseText += `\n\nCustomize notifications: Profile Settings > Notifications`;
      } else {
        responseText += `\n\n${botResponses.notifications.followUp}`;
      }

      return {
        text: responseText,
        sender: "bot",
        timestamp,
        avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
        quickReplies: [
          "Customize notifications",
          "Email preferences",
          "Mobile alerts",
          "Do Not Disturb",
          "Notification types",
        ],
      };
    }

    // Default response
    const randomDefault =
      botResponses.default[
        Math.floor(Math.random() * botResponses.default.length)
      ];
    return {
      text: randomDefault,
      sender: "bot",
      timestamp,
      avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
      quickReplies: [
        "How to register",
        "Login help",
        "Security",
        "Learning plans",
        "Community features",
      ],
    };
  };

  // Handle quick replies
  const handleQuickReply = (question) => {
    setInputValue(question);
    inputRef.current.focus();
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSendMessage(fakeEvent);
    }, 300);
  };

  // Handle input change with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const suggestions = generateSuggestions(value.toLowerCase());
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Generate suggestions based on input
  const generateSuggestions = (input) => {
    const commonQuestions = [
      "How to register with SkillHub?",
      "How to login to the system?",
      "What security features does SkillHub provide?",
      "What is the main purpose of SkillHub?",
      "How to create a learning progress plan?",
      "What category plans does SkillHub offer?",
      "How to publish a post?",
      "How to publish a video post?",
      "How many pictures can I add to a post?",
      "What's the maximum video length for posts?",
      "Can I follow other users' posts?",
      "Can I like, comment or share posts?",
      "When is the system available to users?",
      "What additional features does SkillHub provide?",
      "When are notifications sent to users?",
    ];

    return commonQuestions
      .filter((question) => question.toLowerCase().includes(input))
      .slice(0, 5);
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="skillhub-chatbot">
      {/* SideBar component */}
      <SideBar />
      
      <div className="main-container">
        {/* NavBar component */}
        <NavBar />
        
        {/* Title section */}
        <div className="title-section">
          <h2 className="page-title">
            <span className="chat-icon">💬</span>
            SkillsHub Assistant
          </h2>
          <p className="page-subtitle">
            Get help with registration, learning plans, and platform features
          </p>
        </div>

        {/* Chatbot Container */}
        <div className="chatbot-container">
          {/* Chatbot Header */}
          <div className="chatbot-header">
            <div className="chatbot-info">
              <div className="chatbot-avatar">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                  alt="Chatbot Avatar"
                  className="avatar-img"
                />
                <div className="online-status"></div>
              </div>
              <div>
                <h3 className="chatbot-name">SkillSHub Assistant</h3>
                <p className="chatbot-status">
                  {isTyping ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="chat-messages" ref={chatContainerRef}>
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${
                    message.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="message-avatar">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                        alt="Bot Avatar"
                        className="avatar-img"
                      />
                    </div>
                  )}
                  <div
                    className={`message-bubble ${
                      message.sender === "user" ? "user-bubble" : "bot-bubble"
                    }`}
                  >
                    {message.text.split("\n").map((line, i) => (
                      <p key={i} className="message-text">
                        {line}
                      </p>
                    ))}
                    <div
                      className={`message-time ${
                        message.sender === "user" ? "user-time" : "bot-time"
                      }`}
                    >
                      {message.timestamp}
                    </div>
                    {message.sender === "bot" && message.quickReplies && (
                      <div className="quick-replies">
                        {message.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="quick-reply-btn"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <div className="message-avatar">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="User Avatar"
                        className="avatar-img"
                      />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="message-wrapper bot-message">
                  <div className="message-avatar">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                      alt="Bot Avatar"
                      className="avatar-img"
                    />
                  </div>
                  <div className="message-bubble bot-bubble">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div
                        className="typing-dot"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="typing-dot"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(suggestion);
                      setSuggestions([]);
                      inputRef.current.focus();
                    }}
                    className="suggestion-btn"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask about registration, learning plans, or platform features..."
                className="message-input"
                ref={inputRef}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!inputValue.trim()}
              >
                <FiSend className="send-icon" />
              </button>
            </form>

            {/* Quick Reply Suggestions */}
            <div className="quick-actions">
              <button
                onClick={() =>
                  handleQuickReply("How to register with SkillsHub?")
                }
                className="quick-action-btn"
              >
                <FaUserPlus className="action-icon" /> Register
              </button>
              <button
                onClick={() => handleQuickReply("How to login to the system?")}
                className="quick-action-btn"
              >
                <FaSignInAlt className="action-icon" /> Login
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "What security features does SkillsHub provide?"
                  )
                }
                className="quick-action-btn"
              >
                <FaLock className="action-icon" /> Security
              </button>
              <button
                onClick={() =>
                  handleQuickReply("How to create a learning progress plan?")
                }
                className="quick-action-btn"
              >
                <FaRegFileAlt className="action-icon" /> Learning Plan
              </button>
              <button
                onClick={() => handleQuickReply("How to publish a video post?")}
                className="quick-action-btn"
              >
                <FaVideo className="action-icon" /> Video Posts
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "What categories of courses does SkillsHub offer?"
                  )
                }
                className="quick-action-btn"
              >
                <FaListAlt className="action-icon" /> Course Categories
              </button>
              <button
                onClick={() =>
                  handleQuickReply("How to follow other users on SkillsHub?")
                }
                className="quick-action-btn"
              >
                <FaUserFriends className="action-icon" /> Follow Users
              </button>
              <button
                onClick={() =>
                  handleQuickReply("What are the image limits for posts?")
                }
                className="quick-action-btn"
              >
                <FaImage className="action-icon" /> Image Posts
              </button>
              <button
                onClick={() =>
                  handleQuickReply("What engagement features are available?")
                }
                className="quick-action-btn"
              >
                <FaThumbsUp className="action-icon" /> Engagement
              </button>
              <button
                onClick={() =>
                  handleQuickReply("What is the system availability?")
                }
                className="quick-action-btn"
              >
                <FaClock className="action-icon" /> Availability
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "What additional features does SkillsHub offer?"
                  )
                }
                className="quick-action-btn"
              >
                <FaStar className="action-icon" /> Features
              </button>
              <button
                onClick={() =>
                  handleQuickReply("What is the notification schedule?")
                }
                className="quick-action-btn"
              >
                <FaBell className="action-icon" /> Notifications
              </button>
              <button
                onClick={() =>
                  handleQuickReply("What is the purpose of SkillsHub?")
                }
                className="quick-action-btn"
              >
                <FaQuestionCircle className="action-icon" /> About
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;