import React, { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TrainingModule {
  id: number;
  title: string;
  content: string;
  completed: boolean;
}

const trainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Safety Protocols",
    content: "Learn about fuel handling safety, emergency procedures, and customer safety guidelines. Always wear protective gear and follow proper fuel dispensing procedures.",
    completed: false
  },
  {
    id: 2,
    title: "Customer Service",
    content: "Understand how to provide excellent customer service, handle complaints professionally, and maintain a positive attitude during deliveries.",
    completed: false
  },
  {
    id: 3,
    title: "App Navigation",
    content: "Learn how to use the WeFuel app for accepting orders, updating delivery status, and communicating with customers.",
    completed: false
  }
];

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What should you do if you notice a fuel leak during delivery?",
    options: [
      "Continue with the delivery",
      "Stop immediately, secure the area, and call emergency services",
      "Try to fix it yourself",
      "Ignore it and complete the delivery"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "How should you handle customer complaints?",
    options: [
      "Argue with the customer",
      "Listen actively, apologize if needed, and escalate if necessary",
      "Ignore the complaint",
      "Tell the customer they're wrong"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is the minimum pass rate for the training quiz?",
    options: [
      "60%",
      "70%",
      "80%",
      "90%"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "When should you update the delivery status in the app?",
    options: [
      "Only at the end of the day",
      "At each major step: accepted, picked up, delivering, completed",
      "Never",
      "Only when there's a problem"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What protective gear is required during fuel delivery?",
    options: [
      "No protective gear needed",
      "Safety glasses and gloves",
      "Full hazmat suit",
      "Only a helmet"
    ],
    correctAnswer: 1
  }
];

const DriverTrainingPage: React.FC = () => {
  const [currentModule, setCurrentModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [modules, setModules] = useState(trainingModules);

  const markModuleComplete = (moduleId: number) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, completed: true } : module
    ));
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizAnswers(new Array(quizQuestions.length).fill(-1));
  };

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    setQuizAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionId - 1] = answerIndex;
      return newAnswers;
    });
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    quizAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = (correctAnswers / quizQuestions.length) * 100;
    setScore(percentage);
    setQuizCompleted(true);
  };

  const allModulesCompleted = modules.every(module => module.completed);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Driver Training</h1>
        
        {!showQuiz && !quizCompleted && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Training Progress</h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-gray-600 mt-1">{module.content}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {module.completed ? (
                          <span className="text-green-600 font-medium">✓ Completed</span>
                        ) : (
                          <button
                            onClick={() => markModuleComplete(module.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {allModulesCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  All Training Modules Completed!
                </h3>
                <p className="text-green-700 mb-4">
                  You can now take the final quiz. You need 80% to pass.
                </p>
                <button
                  onClick={startQuiz}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {showQuiz && !quizCompleted && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Final Quiz</h2>
            <div className="space-y-6">
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="border-b pb-4">
                  <h3 className="font-medium mb-3">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          checked={quizAnswers[question.id - 1] === optionIndex}
                          onChange={() => handleQuizAnswer(question.id, optionIndex)}
                          className="text-blue-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={submitQuiz}
                disabled={quizAnswers.includes(-1)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {quizCompleted && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <div className="text-6xl font-bold mb-4">
              {score >= 80 ? (
                <span className="text-green-600">{score}%</span>
              ) : (
                <span className="text-red-600">{score}%</span>
              )}
            </div>
            <p className="text-lg mb-4">
              {score >= 80 ? (
                <span className="text-green-600 font-medium">Congratulations! You passed!</span>
              ) : (
                <span className="text-red-600 font-medium">You need 80% to pass. Please retry.</span>
              )}
            </p>
            {score < 80 && (
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizCompleted(false);
                  setQuizAnswers([]);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Retake Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverTrainingPage; 