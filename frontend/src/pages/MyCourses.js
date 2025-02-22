import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}/learn`);
  };

  return (
    <div>
      {/* My Courses content */}
    </div>
  );
};

export default MyCourses;
