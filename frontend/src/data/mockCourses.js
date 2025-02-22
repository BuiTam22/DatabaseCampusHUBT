export const MOCK_COURSES = [
  {
    id: 1,
    title: "Advanced Web Development",
    description: "Master modern web development with JavaScript, React, and Node.js. Build real-world projects and deploy them.",
    instructor: "John Smith",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Programming",
    level: "advanced",
    rating: 4.8,
    enrolledStudents: {
      count: 156,
      users: [
        {
          id: 1,
          name: "John Doe",
          avatar: "https://i.pravatar.cc/150?img=1",
          progress: 45
        },
        // ... more enrolled students
      ]
    },
    capacity: 200,
    duration: "12 weeks",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    startDate: "2024-03-01",
    price: "$199",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 2}`),
    tags: ["JavaScript", "React", "Node.js"],
    lessons: [
      {
        id: 1,
        title: "1. HTML CSS từ Zero đến Hero",
        duration: "45 minutes",
        type: "theory",
        completed: true,
        content: [{
          type: "video",
          url: "https://www.youtube.com/embed/zwsPND378OQ",
          title: "HTML CSS từ Zero đến Hero",
          description: "Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee."
        }]
      },
      {
        id: 2,
        title: "2. Thực hành HTML cơ bản",
        duration: "60 minutes",
        type: "practical",
        completed: false,
        description: "Thực hành tạo trang web đầu tiên với HTML",
        language: "html",
        initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>The Band</title>
</head>
<body>
  <!-- Viết code của bạn ở đây -->
  
</body>
</html>`,
        examples: [{
          input: "Tạo trang web với header, slider, about section và footer",
          output: "Trang web hoàn chỉnh với đầy đủ các section"
        }],
        testCases: [
          {
            input: "Check header exists",
            expected: true
          },
          {
            input: "Check footer exists",
            expected: true
          }
        ]
      },
      {
        id: 3,
        title: "3. CSS Layout và Flexbox",
        duration: "50 minutes",
        type: "theory",
        completed: false,
        content: [{
          type: "video",
          url: "https://www.youtube.com/embed/0SJE9dYdpps",
          title: "Học CSS Flexbox cơ bản",
          description: "Tìm hiểu về CSS Flexbox và cách sử dụng để tạo layout linh hoạt"
        }]
      },
      {
        id: 4,
        title: "4. CSS Styling - Practice",
        duration: "60 minutes",
        type: "practical",
        completed: false,
        description: "Style your HTML webpage using CSS to create a responsive and beautiful design",
        language: "css",
        initialCode: `/* Style the webpage using CSS */
.header {
  /* Add styles for header */
  
}

.nav-menu {
  /* Create responsive navigation menu */
  
}

.hero-section {
  /* Style hero section with flexbox */
  
}

.about-section {
  /* Add grid layout for about section */
  
}

.footer {
  /* Style footer */
  
}

/* Add media queries for responsive design */
@media (max-width: 768px) {
  /* Add your responsive styles */
  
}`,
        examples: [
          {
            input: "Create responsive layout with flexbox and grid",
            output: `Header with navigation menu
Hero section with centered content
About section with grid layout
Responsive footer`
          }
        ],
        testCases: [
          {
            input: "Check responsive layout",
            expected: "Layout adapts to different screen sizes"
          },
          {
            input: "Check flexbox usage",
            expected: "Flexbox properties are used correctly"
          }
        ]
      },
      {
        id: 5,
        title: "5. JavaScript Basics",
        duration: "55 minutes",
        type: "theory",
        completed: false,
        content: [{
          type: "video",
          url: "https://www.youtube.com/embed/example3",
          title: "JavaScript Introduction",
          description: "Getting started with JavaScript programming"
        }]
      },
      {
        id: 6,
        title: "6. JavaScript DOM - Practice",
        duration: "45 minutes",
        type: "practical",
        completed: false,
        description: "Create an interactive todo list using JavaScript DOM manipulation",
        language: "javascript",
        initialCode: `// Create Todo List functionality
class TodoList {
  constructor() {
    this.tasks = [];
  }
  
  // Add new task
  addTask(title) {
    // Your code here
  }
  
  // Remove task
  removeTask(id) {
    // Your code here
  }
  
  // Toggle task completion
  toggleTask(id) {
    // Your code here
  }
  
  // Render tasks to DOM
  render() {
    // Your code here
  }
}

// Initialize Todo List
const todoList = new TodoList();

// Add event listeners
document.getElementById('add-task').addEventListener('click', () => {
  // Your code here
});`,
        examples: [
          {
            input: "Create todo list with add, remove, and toggle functionality",
            output: "Working todo list with interactive features"
          }
        ],
        testCases: [
          {
            input: "Add new task",
            expected: "Task is added to the list"
          },
          {
            input: "Toggle task completion",
            expected: "Task status is toggled"
          },
          {
            input: "Remove task",
            expected: "Task is removed from the list"
          }
        ]
      },
      {
        id: 7,
        title: "7. JavaScript Functions & Objects",
        duration: "45 minutes",
        type: "theory",
        completed: false,
        content: [{
          type: "video",
          url: "https://www.youtube.com/embed/example4",
          title: "JavaScript Functions and Objects",
          description: "Learn about functions, objects, and their usage in JavaScript"
        }]
      },
      {
        id: 8,
        title: "8. JavaScript Array Methods",
        duration: "60 minutes",
        type: "practical",
        completed: false,
        description: "Practice using common array methods in JavaScript",
        language: "javascript",
        initialCode: `// Write a function to filter even numbers from an array
function filterEvenNumbers(numbers) {
  // Your code here
  
}

// Write a function to find the sum of all numbers in an array
function sumArray(numbers) {
  // Your code here
  
}

// Test your functions
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(filterEvenNumbers(numbers));
console.log(sumArray(numbers));`,
        examples: [
          {
            input: "[1, 2, 3, 4, 5]",
            output: "filterEvenNumbers() => [2, 4]\nsumArray() => 15"
          }
        ],
        testCases: [
          {
            input: [1, 2, 3, 4, 5],
            expected: {
              filterEven: [2, 4],
              sum: 15
            }
          }
        ]
      },
      {
        id: 9,
        title: "9. React Components",
        duration: "55 minutes",
        type: "theory",
        completed: false,
        content: [{
          type: "video",
          url: "https://www.youtube.com/embed/example5",
          title: "Introduction to React Components",
          description: "Learn about React components, props, and state"
        }]
      },
      {
        id: 10,
        title: "10. Build a React Counter",
        duration: "45 minutes",
        type: "practical",
        completed: false,
        description: "Create a simple counter component using React hooks",
        language: "jsx",
        initialCode: `import React, { useState } from 'react';

function Counter() {
  // Add state for count
  
  return (
    <div>
      {/* Add counter UI here */}
      
    </div>
  );
}

export default Counter;`,
        examples: [
          {
            input: "Create a counter with increment and decrement buttons",
            output: "A working counter component with buttons and display"
          }
        ],
        testCases: [
          {
            input: "Check initial render",
            expected: "Counter displays 0"
          },
          {
            input: "Click increment",
            expected: "Counter increases by 1"
          }
        ]
      },
      {
        id: 11,
        title: "API Integration",
        duration: "60 minutes",
        type: "practical",
        completed: false,
        description: "Learn to fetch and display data from an API",
        language: "javascript",
        initialCode: `// Fetch users from the API and display their names
async function fetchUsers() {
  try {
    // Fetch data from: https://jsonplaceholder.typicode.com/users
    
    // Return array of user names
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Test the function
fetchUsers().then(users => console.log(users));`,
        examples: [
          {
            input: "Call fetchUsers()",
            output: '["John Doe", "Jane Smith", ...]'
          }
        ],
        testCases: [
          {
            input: "Check API call",
            expected: "Array of user names"
          }
        ]
      }
    ],
    resources: [
      {
        type: "pdf",
        title: "Course Handbook",
        url: "https://example.com/handbook.pdf"
      },
      {
        type: "code",
        title: "Starter Project",
        url: "https://github.com/example/starter"
      }
    ],
    ratingDistribution: {
      5: 65,
      4: 20,
      3: 10,
      2: 3,
      1: 2
    },
    reviews: [
      {
        userName: "John Doe",
        userAvatar: "https://example.com/avatar1.jpg",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent course! Very detailed and well-explained.",
        response: "Thank you for your feedback!"
      },
      // ... more reviews
    ],
    instructorDetails: {
      name: "John Smith",
      avatar: "https://example.com/avatar.jpg",
      title: "Senior Web Developer",
      totalStudents: 1000,
      totalCourses: 5,
      rating: 4.8,
      bio: "Experienced web developer...",
      expertise: ["JavaScript", "React", "Node.js"],
      otherCourses: []
    }
  },
  {
    id: 2,
    title: "UI/UX Design Principles",
    description: "Learn modern design principles, user research, wireframing, and prototyping with Figma and Adobe XD.",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://i.pravatar.cc/150?img=5",
    category: "Design",
    level: "intermediate",
    rating: 4.9,
    enrolledStudents: {
      count: 98,
      users: [
        {
          id: 1,
          name: "Sarah Doe",
          avatar: "https://i.pravatar.cc/150?img=5",
          progress: 75
        },
        // ... more enrolled students
      ]
    },
    capacity: 100,
    duration: "10 weeks",
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
    startDate: "2024-04-15",
    price: "$149",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 7}`),
    tags: ["UI Design", "UX Research", "Figma"],
    lessons: [
      {
        id: 1,
        title: "Introduction to UI/UX Design",
        duration: "50 minutes",
        type: "video",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/uiux-intro",
            duration: "35 mins",
            description: "Understanding UI/UX fundamentals"
          },
          {
            type: "quiz",
            questions: 8,
            duration: "15 mins",
            description: "Basic design principles quiz"
          }
        ]
      },
      {
        id: 2,
        title: "Working with Figma",
        duration: "75 minutes",
        type: "practical",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/figma-basics",
            duration: "45 mins",
            description: "Getting started with Figma"
          },
          {
            type: "assignment",
            duration: "30 mins",
            description: "Create your first design in Figma"
          }
        ]
      }
    ],
    resources: [
      {
        type: "pdf",
        title: "Design Guidelines",
        url: "https://example.com/design-guide.pdf"
      },
      {
        type: "template",
        title: "Figma UI Kit",
        url: "https://figma.com/template"
      }
    ]
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Introduction to data analysis, machine learning, and statistical modeling using Python and popular libraries.",
    instructor: "Michael Chen",
    instructorAvatar: "https://i.pravatar.cc/150?img=12",
    category: "Data Science",
    level: "beginner",
    rating: 4.7,
    enrolledStudents: {
      count: 210,
      users: [
        {
          id: 1,
          name: "Michael Doe",
          avatar: "https://i.pravatar.cc/150?img=12",
          progress: 60
        },
        // ... more enrolled students
      ]
    },
    capacity: 250,
    duration: "14 weeks",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    startDate: "2024-05-01",
    price: "$179",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 13}`),
    tags: ["Python", "Machine Learning", "Statistics"],
    lessons: [
      {
        id: 1,
        title: "Python for Data Science",
        duration: "60 minutes",
        type: "video",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/python-ds",
            duration: "40 mins",
            description: "Python basics for data analysis"
          },
          {
            type: "quiz",
            questions: 12,
            duration: "20 mins",
            description: "Python fundamentals assessment"
          }
        ]
      },
      {
        id: 2,
        title: "Data Analysis with Pandas",
        duration: "90 minutes",
        type: "practical",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/pandas-intro",
            duration: "50 mins",
            description: "Introduction to Pandas library"
          },
          {
            type: "assignment",
            duration: "40 mins",
            description: "Data analysis project with Pandas"
          }
        ]
      },
      {
        id: 3,
        title: "Statistical Methods",
        duration: "70 minutes",
        type: "video",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/stats",
            duration: "45 mins",
            description: "Basic statistical concepts"
          },
          {
            type: "quiz",
            questions: 15,
            duration: "25 mins",
            description: "Statistics practice problems"
          }
        ]
      }
    ],
    resources: [
      {
        type: "pdf",
        title: "Python Cheat Sheet",
        url: "https://example.com/python-cheatsheet.pdf"
      },
      {
        type: "code",
        title: "Data Analysis Templates",
        url: "https://github.com/example/data-templates"
      },
      {
        type: "dataset",
        title: "Practice Datasets",
        url: "https://example.com/datasets"
      }
    ]
  },
  {
    id: 4,
    title: "Mobile App Development with React Native",
    description: "Learn to build cross-platform mobile applications using React Native. Create beautiful, responsive apps for both iOS and Android.",
    instructor: "John Smith",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Programming",
    level: "intermediate",
    rating: 4.9,
    enrolledStudents: {
      count: 85,
      users: [
        {
          id: 1,
          name: "John Smith",
          avatar: "https://i.pravatar.cc/150?img=1",
          progress: 80
        }
      ]
    },
    capacity: 100,
    duration: "10 weeks",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    startDate: "2024-03-20",
    price: "$179",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 20}`),
    tags: ["React Native", "Mobile", "JavaScript"],
    lessons: [
      {
        id: 1,
        title: "Introduction to React Native",
        duration: "45 minutes",
        type: "video",
        completed: true,
        content: [
          {
            type: "video",
            url: "https://example.com/react-native-intro",
            duration: "30 mins",
            description: "Getting started with React Native"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Cloud Computing with AWS",
    description: "Master cloud computing concepts and AWS services. Learn to deploy scalable and secure applications on the cloud.",
    instructor: "John Smith",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Cloud Computing",
    level: "advanced",
    rating: 4.7,
    enrolledStudents: {
      count: 120,
      users: [
        {
          id: 1,
          name: "John Smith",
          avatar: "https://i.pravatar.cc/150?img=1",
          progress: 65
        }
      ]
    },
    capacity: 150,
    duration: "12 weeks",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    startDate: "2024-04-01",
    price: "$199",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 25}`),
    tags: ["AWS", "Cloud", "DevOps"],
    lessons: [
      {
        id: 1,
        title: "AWS Fundamentals",
        duration: "60 minutes",
        type: "video",
        completed: true,
        content: [
          {
            type: "video",
            url: "https://example.com/aws-basics",
            duration: "45 mins",
            description: "Introduction to AWS services"
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Blockchain Development",
    description: "Explore blockchain technology and smart contract development. Build decentralized applications using Ethereum and Solidity.",
    instructor: "John Smith",
    instructorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "Blockchain",
    level: "advanced",
    rating: 4.8,
    enrolledStudents: {
      count: 75,
      users: [
        {
          id: 1,
          name: "John Smith",
          avatar: "https://i.pravatar.cc/150?img=1",
          progress: 40
        }
      ]
    },
    capacity: 100,
    duration: "14 weeks",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    startDate: "2024-04-15",
    price: "$249",
    students: Array(5).fill().map((_, i) => `https://i.pravatar.cc/150?img=${i + 30}`),
    tags: ["Blockchain", "Ethereum", "Solidity"],
    lessons: [
      {
        id: 1,
        title: "Blockchain Fundamentals",
        duration: "55 minutes",
        type: "video",
        completed: false,
        content: [
          {
            type: "video",
            url: "https://example.com/blockchain-basics",
            duration: "40 mins",
            description: "Understanding blockchain technology"
          }
        ]
      }
    ]
  }
];