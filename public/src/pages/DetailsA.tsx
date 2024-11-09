import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API;


const DetailsA: React.FC = () => {
  let { id } = useParams();
  const [result, setResult] = useState<any>({});

  useEffect(() => {
    fetchApproaches();
  }, []);

  const fetchApproaches = async () => {
    try {
      id = id?.split("%20").join(" ");
      console.log(id);
      let { data } = await axios.post(`${apiUrl}/detaila`, { topic: id });
      data = JSON.parse(data);
      console.log(data);
      setResult(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Heading and Question Section */}
      <h1 className="text-3xl font-bold mb-4">{result.question}</h1>

      {/* Render Each Approach */}
      <div className="space-y-4 mt-6">
        {result.approaches && result.approaches.map((approach: any, index: number) => (
          <div key={index} className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Approach Name */}
              <h2 className="card-title text-xl font-semibold">{approach.name}</h2>
              
              {/* Approach Description */}
              <p className="text-gray-600 mt-2">{approach.description}</p>

              {/* Check if approach.code is an object */}
              {typeof approach.code === 'object' ? (
                <div className="bg-gray-800 text-white rounded-lg p-4 mt-4">
                  {/* Render code for each language if approach.code is an object */}
                  {Object.keys(approach.code).map((language) => (
                    <div key={language} className="mb-4">
                      <h3 className="text-lg font-bold capitalize">{language}</h3>
                      <pre className="whitespace-pre-wrap">
                        <code>{approach.code[language]}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                // If approach.code is a string, render it directly
                <div className="bg-gray-800 text-white rounded-lg p-4 mt-4">
                  <pre className="whitespace-pre-wrap">
                    <code>{approach.code}</code>
                  </pre>
                </div>
              )}

              {/* Complexity */}
              <div className="mt-4">
                <p className="text-sm text-gray-400">{approach.complexity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsA;
