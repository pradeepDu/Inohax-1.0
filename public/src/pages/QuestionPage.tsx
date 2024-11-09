import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setQuestion, useAppDispatch } from "./redux";

type Question = {
  id: number;
  question: string;
};

interface QuestionData {
  [key: string]: Question[];
}

// Predefined question sets
const questionData: QuestionData = {
  Java: [
    {
      id: 1,
      question:
        "Biker Race Qualification Program: Five bikers compete in a race where they drive at constant speeds. Write a Java program to take as input the speed of each racer and print the speed of qualifying racers.",
    },
    {
      id: 2,
      question:
        "Salary Calculation Program: Write a Java program to calculate gross salary and net salary using the following data: Input: empno, empname, basic. Process: DA = 70% of basic, HRA = 30% of basic, CCA = Rs 240/-, PF = 10% of basic, PT = Rs 100/-.",
    },
    {
      id: 3,
      question:
        "Quadratic Equation Solver: Write a Java program that prints all real solutions to the quadratic equation: ax² + bx + c = 0. If the discriminant is negative, display a message indicating that there are no real solutions.",
    },
    {
      id: 4,
      question:
        "Simple Banking Application (Menu-Driven): Write a menu-driven Java program to implement a simple banking application. Methods include createAccount(), deposit(), withdraw(), computeInterest(), and displayBalance().",
    },
    {
      id: 5,
      question:
        "Rectangle Area Calculation: Write a Java program to calculate the area of a rectangle. Create a class named Area with methods to set dimensions and get the area.",
    },
    {
      id: 6,
      question:
        "Constructor Chaining: Write a Java program to illustrate constructor chaining.",
    },
    {
      id: 7,
      question:
        "Vector String Operations: Write a Java program to add n strings to a vector array, check if a new string is present, and either delete it or add it to the vector.",
    },
    {
      id: 8,
      question:
        "Reverse Array List: Write a Java program to print a reversed array list by creating your own function.",
    },
    {
      id: 9,
      question:
        "Book Class Inheritance: Create a class Book and inherit Reference_Book and Magazine classes from it, overriding the display method in both.",
    },
    {
      id: 10,
      question:
        "Amount in Words (User-defined Package): Create a class AmountInWords within a user-defined package to convert an amount into words.",
    },
    {
      id: 11,
      question:
        "Vehicle Interface: Create an interface Vehicle with functionalities for Bicycle, Car, and Bike. Implement these in their respective classes.",
    },
    {
      id: 12,
      question:
        "Sportsperson Hierarchy: Create a hierarchy where a sportsperson can be an athlete or a hockey player, with methods to display information and demonstrate polymorphism.",
    },
    {
      id: 13,
      question:
        "Login Program with Exception Handling: Write a program where the password must meet specific criteria and throw an exception if invalid.",
    },
    {
      id: 14,
      question:
        "Concurrent Banking Transactions: Simulate concurrent banking transactions between two brothers sharing a bank account.",
    },
    {
      id: 15,
      question:
        "Java File Filter Program: Write a program that filters Java files from a directory based on the file extension.",
    },
    {
      id: 16,
      question:
        "GUI Calculator (Grid Layout): Create a simple calculator using a grid layout for buttons and a text field to display results.",
    },
    {
      id: 17,
      question:
        "MyInfo Program: Create a window with text fields for user details and display them in a styled format when a button is clicked.",
    },
    {
      id: 18,
      question:
        "Color Palette Program: Create a color palette using buttons for different colors that change the background color when clicked.",
    },
  ],
  Python: [
    {
      id: 1,
      question:
        'Standard I/O: Write a program that prints "Hello World" and takes a name as input to display a greeting message.',
    },
    {
      id: 2,
      question:
        "Data type, Type conversions: Write a program to check the data type of numeric variables (int, float, complex) and convert a given number to binary, octal, and hexadecimal forms.",
    },
    {
      id: 3,
      question:
        "Loops (While, For), if...elif...else: Write programs to print even and odd numbers between 1 to 10 using loops, with variations in formatting and order.",
    },
    {
      id: 4,
      question:
        "Input (command line), Data Types (Numeric - Decimal, Bin, Oct, Hex), Type Conversions, Print, Comparison Operator: Write a program that takes a student’s name and subject marks as input from the command line, converts and displays the marks in various formats, and checks pass or fail status.",
    },
    {
      id: 5,
      question:
        "Loops (While, For): Write programs to calculate simple and compound interest, find the Fibonacci series, and print a pattern using loops.",
    },
    {
      id: 6,
      question:
        "String and its methods: Write a program that manipulates a string by replacing a substring, finding the position of a word, and reversing the string using different methods.",
    },
    {
      id: 7,
      question:
        "Lists and its methods: Write a menu-driven program that demonstrates list operations, including sorting, updating elements, and checking for the presence of a word.",
    },
    {
      id: 8,
      question:
        "Lists and its methods: Write a program to record sales data, calculate total earnings, identify the highest-selling product, and calculate the average sales amount.",
    },
    {
      id: 9,
      question:
        "Tuple and Operations on tuple: Write a menu-driven program to demonstrate tuple operations such as adding student records, sorting nested tuples, and updating tuples.",
    },
    {
      id: 10,
      question:
        "Dictionary and its Methods: Create a menu-driven program that takes input (Aadhar ID, name, age, weight) and performs dictionary operations, including displaying data, modifying records, adding new records, and deleting existing records.",
    },
    {
      id: 11,
      question:
        "Object-Oriented Programming - Cricket Players Data: Write a menu-driven program to store, display, update, and delete cricket players' records using OOP principles.",
    },
    {
      id: 12,
      question:
        "Experiment 8: Perform file operations by storing stock data in a CSV file, displaying saved data, modifying records, counting stocks, and making a copy of an image file.",
    },
    {
      id: 13,
      question:
        "Experiment 9: Take two numbers as input and log errors in mylog.txt, asserting that one number is even, handling division by zero, and checking bounds for another number.",
    },
    {
      id: 14,
      question:
        "Experiment 10: Create a login application using Tkinter and SQLite.",
    },
  ],
  C: [
    { id: 1, question: "What is a pointer in C?" },
    { id: 2, question: "Explain memory management in C." },
    {
      id: 3,
      question: "Write a program to find roots of a quadratic equation.",
    },
    {
      id: 4,
      question:
        "Write a program to swap two integers with and without using temporary variables.",
    },
    {
      id: 5,
      question:
        "Write a program to calculate the volume of a cone. Accept radius & height from the user.",
    },
    {
      id: 6,
      question:
        "Write a program to find the greatest among three integers using ternary operator & if-else.",
    },
    {
      id: 7,
      question:
        "An electric power distribution company charges its domestic customer as follows: Consumption Units Rate of charge 0 - 200 0.50 per unit, 201 - 400 Rs. 100 plus 0.65 per unit excess of 200 units, 401 - 600 Rs. 230 plus 0.85 per unit excess of 400 units, 601 & above Rs. 390 plus 1.00 per unit excess of 600 units. Program should read units consumed for a customer and calculate the total bill.",
    },
    {
      id: 8,
      question:
        "Write a program to take input for a character and print the month names starting with that character using a switch case. (Ex: I/P = ‘A’, O/P = April, August).",
    },
    {
      id: 9,
      question:
        "Write a program to find the result of the series: 1 - 22/3 + 32/5 - ........+ n2/(2n-1).",
    },
    {
      id: 10,
      question:
        "Write a program to print the following pattern: (Take input for the no. of lines ‘N’).",
    },
    {
      id: 11,
      question:
        "Write a program to print the following pattern: (Take input for the no. of lines ‘N’).",
    },
    {
      id: 12,
      question:
        "Write a program to find if the given number is palindrome number or not.",
    },
    {
      id: 13,
      question:
        "Write a program for the sum of natural numbers using a recursive function.",
    },
    {
      id: 14,
      question:
        "Write a program to illustrate different ways of passing parameters to a function to demonstrate increment/decrement operators.",
    },
    {
      id: 15,
      question:
        "Write a program to cyclically rotate elements of the integer array in the right direction.",
    },
    {
      id: 16,
      question: "Write a program to find transpose using the same matrix.",
    },
    {
      id: 17,
      question:
        "Write a program to find the reverse of a string using another string (Define a user defined function to find the length of the string).",
    },
    {
      id: 18,
      question:
        "Write a program using Structure to accept employee name, emp_id, date_of_joining and salary. Display the result in descending order of salary. Store data for N Employees.",
    },
    {
      id: 19,
      question:
        "Write a program to dynamically allocate memory for the user entered size ‘N’ of an array, accept ‘N’ integers from the user and find the average of these integers using function and pointer (Pass array to the function using pointer).",
    },
  ],
  JavaScript: [
    {
      id: 1,
      question:
        'Standard I/O: Write a program that prints "Hello World" and takes a name as input to display a greeting message.',
    },
    {
      id: 2,
      question:
        "Data types and Type conversions: Write a program to check the data type of variables (string, number, boolean) and convert a given number to binary, octal, and hexadecimal forms.",
    },
    {
      id: 3,
      question:
        "Loops (For, While): Write programs to print even and odd numbers between 1 to 10 using loops, with variations in formatting and order.",
    },
    {
      id: 4,
      question:
        "Input: Write a program that takes a user's age and checks if they are eligible to vote.",
    },
    {
      id: 5,
      question:
        "Functions: Write a program to calculate the factorial of a number using a recursive function.",
    },
    {
      id: 6,
      question:
        "Arrays: Write a program that creates an array of numbers, sorts it, and prints the largest and smallest numbers.",
    },
    {
      id: 7,
      question:
        "Objects: Write a program to create an object representing a book with properties like title, author, and year, and a method to display its details.",
    },
    {
      id: 8,
      question:
        "JSON: Write a program that converts a JavaScript object to a JSON string and back to an object.",
    },
    {
      id: 9,
      question:
        "Error Handling: Write a program that demonstrates try...catch to handle exceptions when parsing JSON.",
    },
    {
      id: 10,
      question:
        "DOM Manipulation: Write a program that creates a simple web page with a button. When the button is clicked, display an alert with a message.",
    },
    {
      id: 11,
      question:
        "Event Handling: Write a program that adds an event listener to a button to change the text of a paragraph when clicked.",
    },
    {
      id: 12,
      question:
        "Asynchronous JavaScript: Write a program that fetches data from a public API and displays it on the web page.",
    },
    {
      id: 13,
      question:
        "Promises: Write a program that uses promises to handle asynchronous operations and logs the result to the console.",
    },
    {
      id: 14,
      question:
        "Local Storage: Write a program that saves user input from a form to local storage and retrieves it on page load.",
    },
  ],
};

interface QuestionsPageProps {
  module: keyof QuestionData;
}

const QuestionsPage: React.FC<QuestionsPageProps> = ({ module }) => {
  const dispatch = useAppDispatch();
  // Initialize state to store questions
  const [questions, setQuestions] = useState<Question[]>([]);

  // Use useEffect to update state when the module changes
  useEffect(() => {
    const selectedQuestions = questionData[module] || [];
    setQuestions(selectedQuestions); // Set the questions in state
  }, [module]); // Effect re-runs when module prop changes

  const navigate = useNavigate();

  const handleclick = (question: string) => {
    dispatch(setQuestion({ question }));
    navigate("/ai-tutor");
  };
  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Questions for {module}
        </h1>
        <ul className="space-y-4">
          {questions.map((q) => (
            <li
              key={q.id}
              className="card bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center"
            >
              <div className="basis-8/12">
                <p
                  className="text-lg font-semibold text-gray-800 "
                  onClick={() => {
                    handleclick(q.question);
                  }}
                >
                  {q.question}
                </p>
              </div>
              <div className="basis-4/12 ">
                <button className="btn-primary btn text-white ">Solve</button>
              </div>
            </li>
          ))}
        </ul>
        {questions.length === 0 && (
          <p className="text-xl text-white text-center mt-4">
            No questions available for {module}.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
