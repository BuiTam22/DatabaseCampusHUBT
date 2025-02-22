export const submitExam = async (examData) => {
  try {
    const response = await fetch('/api/exams/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting exam:', error);
    throw error;
  }
}; 