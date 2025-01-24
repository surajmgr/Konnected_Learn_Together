import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authContext";
import Breadcrum from "../utils/breadcrum";
import parse from "html-react-parser";
import "../topics/topics.css";
import "../questions/question.css";

// React Notification
import { Store } from "react-notifications-component";
import LargeLoading from "../utils/largeLoading";

import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Ticks,
} from "chart.js";
import {
  Doughnut,
  Bar,
  Line,
  Pie,
  PolarArea,
  Radar,
  Bubble,
  Scatter,
} from "react-chartjs-2";

ChartJS.register(
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// src/utils.js

export const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

export const transparentize = (color, alpha) => {
  // Function to make a color transparent by alpha
  // if rgb color, convert to hex
  let r = 0;
  let g = 0;
  let b = 0;
  if (color.startsWith("rgb")) {
    const rgb = color.replace("rgb(", "").replace(")", "").split(",");
    r = parseInt(rgb[0]);
    g = parseInt(rgb[1]);
    b = parseInt(rgb[2]);
  } else {
    let hexColor = color.replace("#", "");
    r = parseInt(hexColor.substring(0, 2), 16);
    g = parseInt(hexColor.substring(2, 4), 16);
    b = parseInt(hexColor.substring(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const numbers = (length) => {
  // Generate an array of random numbers
  return Array.from({ length }, () => Math.floor(Math.random() * 100));
};

export function DoughnutChart({ data }) {
  const correctDoughnutData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Correct",
        data: [data.correct.length, data.incorrect.length],
        borderColor: [
          transparentize(CHART_COLORS.green, 0.5),
          transparentize(CHART_COLORS.red, 0.5),
        ],
        backgroundColor: [CHART_COLORS.green, CHART_COLORS.red],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    // height and width are set here
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Correct vs Incorrect",
        position: "bottom",
      },
    },
  };

  const textInsidePlugin = {
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;

      const smallShift = 8;

      // Get the chart center dynamically
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom + smallShift) / 2;

      ctx.save();
      ctx.font = "15px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw the text at the center of the chart area
      ctx.fillText(
        (
          (data.correct.length /
            (data.correct.length + data.incorrect.length)) *
          100
        ).toFixed(0) + "%",
        centerX,
        centerY
      );
      ctx.restore();
    },
  };

  return (
    <Doughnut
      data={correctDoughnutData}
      options={options}
      plugins={[textInsidePlugin]}
    />
  );
}

export function FullColorDoughnut({ label, data, insidetext, color }) {
  const config_data = {
    labels: [label],
    datasets: [
      {
        label: label,
        data: [data],
        borderColor: [transparentize(color, 0.5)],
        backgroundColor: [color],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    // height and width are set here
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: insidetext,
        position: "bottom",
      },
      textInside: {
        text: insidetext,
        color: "black",
        fontSize: 20,
      },
    },
  };

  const textInsidePlugin = {
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;

      const smallShift = 8;

      // Get the chart center dynamically
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom + smallShift) / 2;

      ctx.save();
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;

      // Draw the text at the center of the chart area
      ctx.fillText(data, centerX, centerY);
      ctx.restore();
    },
  };

  return (
    <Doughnut
      data={config_data}
      options={options}
      plugins={[textInsidePlugin]}
    />
  );
}

export function BarChartsBySubtopic({ data }) {
  const allQuestions = [...data.correct, ...data.incorrect];

  // Group questions by subtopic
  const groupedQuestions = allQuestions.reduce((acc, question) => {
    const { subtopic } = question;

    if (!acc[subtopic]) {
      acc[subtopic] = [];
    }

    acc[subtopic].push(question);
    return acc;
  }, {});

  // Find the maximum number of questions in a subtopic
  const maxQuestions = Math.max(
    ...Object.values(groupedQuestions).map((group) => group.length)
  );

  console.log(maxQuestions);

  // Create the labels
  let labels = Object.values(groupedQuestions).map(
    (group) => group[0].subtopic
  );

  // lables should be the name of the subtopic
  labels = labels.map((subtopic) => data.subtopic[subtopic].info.name);

  // Prepare the datasets for each subtopic
  const datasets = [];
  let stackIndex = 1; // To create different stack groups like ques_1, ques_2, etc.

  for (let i = 0; i < maxQuestions; i++) {
    // Prepare data for a, b, c per subtopic
    const aData = [];
    const bData = [];
    const cData = [];

    Object.entries(groupedQuestions).forEach(([subtopic, questions]) => {
      const question = questions[i];

      if (question) {
        aData.push(question.a);
        bData.push(question.b);
        cData.push(question.c);
      } else {
        aData.push(0);
        bData.push(0);
        cData.push(0);
      }
    });

    // Add the datasets for a, b, and c
    datasets.push({
      label: `discrimination`,
      data: aData,
      borderColor: CHART_COLORS.red,
      backgroundColor: transparentize(CHART_COLORS.red, 0.5),
      borderRadius: Number.MAX_VALUE,
      borderWidth: 1,
      stack: `ques_${stackIndex}`,
    });
    datasets.push({
      label: `difficulty`,
      data: bData,
      borderColor: CHART_COLORS.blue,
      backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
      borderRadius: 30,
      borderWidth: 1,
      stack: `ques_${stackIndex}`,
    });
    datasets.push({
      label: `guessing`,
      data: cData,
      borderColor: CHART_COLORS.green,
      backgroundColor: transparentize(CHART_COLORS.green, 0.5),
      borderRadius: 5,
      borderWidth: 1,
      stack: `ques_${stackIndex}`,
    });

    stackIndex++; // Increment to create unique stack names
  }

  // Chart configuration
  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "right",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            // Get acronym for the subtopic name
            return this.getLabelForValue(value)
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 5);
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export const BubbleChart = ({ data }) => {
  // Prepare the correct data
  const correctData = data.correct.map((item) => ({
    x: item.c,
    y: item.b,
    r: Math.abs(item.new_theta * 10),
    label: `Q${item.qid}`, // Add unique label for each question
  }));

  // Prepare the incorrect data
  const incorrectData = data.incorrect.map((item) => ({
    x: item.c,
    y: item.b,
    r: Math.abs(item.new_theta * 10),
    label: `Q${item.qid}`, // Add unique label for each question
  }));

  // Chart.js Data Configuration
  const chartData = {
    datasets: [
      {
        label: "Correct Answers",
        data: correctData,
        backgroundColor: "rgba(0, 255, 0, 0.6)", // Color for correct answers
        hoverBackgroundColor: "rgba(0, 255, 0, 1)",
      },
      {
        label: "Incorrect Answers",
        data: incorrectData,
        backgroundColor: "rgba(255, 0, 0, 0.6)", // Color for incorrect answers
        hoverBackgroundColor: "rgba(255, 0, 0, 1)",
      },
    ],
  };

  console.log(chartData);

  // Chart.js Options Configuration
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Guessing",
        },
      },
      y: {
        title: {
          display: true,
          text: "Difficulty",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            // Display the label in tooltip
            return `Question ID: ${tooltipItem.raw.label}, Difficulty: ${
              tooltipItem.raw.y
            }, Guessing: ${tooltipItem.raw.x}, Ability: ${
              tooltipItem.raw.r / 10
            }`;
          },
        },
      },
    },
  };

  return (
    <div>
      <Bubble data={chartData} options={chartOptions} />
    </div>
  );
};

export const QuizReport = ({ data }) => {
  // Process the correct and total data
  const correctData = {
    labels: [], // Subtopic names
    correct: [], // Correct answers count
    total: [], // Total questions count
  };
  Object.keys(data.subtopic).forEach((subtopicId) => {
    const subtopic = data.subtopic[subtopicId];
    correctData.labels.push(subtopic.info.name);
    correctData.correct.push(subtopic.history.correct);
    correctData.total.push(subtopic.history.total);
  });

  const barChartData = {
    labels: correctData.labels,
    datasets: [
      {
        label: "Correct Answers",
        data: correctData.correct,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Questions",
        data: correctData.total,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <Bar
      data={barChartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
        },
      }}
    />
  );
};

export const PieChart = ({ data }) => {
  const incorrectData = {
    labels: [], // Subtopic names
    incorrect: [], // Incorrect answers count
  };

  Object.keys(data.subtopic).forEach((subtopicId) => {
    const incorrectCount = data.incorrect.filter(
      (item) => item.subtopic === Number(subtopicId)
    ).length;
    incorrectData.labels.push(data.subtopic[subtopicId].info.name);
    incorrectData.incorrect.push(incorrectCount);
  });

  // Chart.js data for the pie chart (incorrect answers by subtopic)
  const pieChartData = {
    labels: incorrectData.labels,
    datasets: [
      {
        label: "Incorrect Answers",
        data: incorrectData.incorrect,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={pieChartData} options={{ responsive: true }} />;
};

export function RoundedBarChart({ data }) {
  const oldTheta = [];
  const newTheta = [];
  const subtopicNames = [];

  Object.keys(data.subtopic).forEach((subtopicId) => {
    const subtopic = data.subtopic[subtopicId];
    oldTheta.push(subtopic.old_theta);
    newTheta.push(subtopic.history.theta);
    subtopicNames.push(subtopic.info.name);
  });

  const barChartData = {
    labels: subtopicNames,
    datasets: [
      {
        label: "Old Theta",
        data: oldTheta,
        backgroundColor: transparentize(CHART_COLORS.red, 0.5),
        borderColor: CHART_COLORS.red,
        borderRadius: Number.MAX_VALUE,
        borderWidth: 2,
        borderSkipped: false,
      },
      {
        label: "New Theta",
        data: newTheta,
        backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
        borderColor: CHART_COLORS.blue,
        borderRadius: 10,
        borderWidth: 2,
        borderSkipped: false,
      },
    ],
  };

  return (
    <Bar
      data={barChartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              callback: function (value) {
                // Get acronym for the subtopic name
                return this.getLabelForValue(value)
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .substring(0, 5);
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
        },
      }}
    />
  );
}

function Quiz() {
  const data = {
    correct: [
      {
        qid: 1,
        answer: "Define the problem state and the initial state.",
        a: 0.12,
        b: 0.55,
        c: 0.33,
        subtopic: 284667,
        new_theta: 0.22,
      },
      {
        qid: 2,
        answer: "Linear",
        a: 0.19,
        b: 1.35,
        c: -0.85,
        subtopic: 284712,
        new_theta: 0.31,
      },
      {
        qid: 3,
        answer: "Exponential",
        a: -0.18,
        b: 0.13,
        c: 0.32,
        subtopic: 284793,
        new_theta: 0.95,
      },
      {
        qid: 4,
        answer: "Define the problem state and the initial state.",
        a: 1.98,
        b: 1.25,
        c: -0.88,
        subtopic: 285295,
        new_theta: 0.12,
      },
      {
        qid: 5,
        answer: "Linear",
        a: -0.14,
        b: 0.18,
        c: 0.29,
        subtopic: 285169,
        new_theta: 1.4,
      },
      {
        qid: 6,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.87,
        b: 1.28,
        c: -0.89,
        subtopic: 285031,
        new_theta: -0.85,
      },
      {
        qid: 7,
        answer: "Exponential",
        a: -0.16,
        b: 0.16,
        c: 0.34,
        subtopic: 284667,
        new_theta: -0.19,
      },
    ],
    incorrect: [
      {
        qid: 8,
        answer: "Linear",
        a: 0.88,
        b: 1.25,
        c: -0.85,
        subtopic: 284712,
        new_theta: -0.28,
      },
      {
        qid: 9,
        answer: "Define the problem state and the initial state.",
        a: -0.12,
        b: 0.12,
        c: 0.29,
        subtopic: 284793,
        new_theta: -2.8,
      },
      {
        qid: 10,
        answer: "Exponential",
        a: 0.95,
        b: 1.3,
        c: -0.91,
        subtopic: 285295,
        new_theta: 0.13,
      },
      {
        qid: 11,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.89,
        b: 1.27,
        c: -0.92,
        subtopic: 285169,
        new_theta: -0.35,
      },
      {
        qid: 12,
        answer: "Exponential",
        a: -0.55,
        b: 0.48,
        c: 0.35,
        subtopic: 285031,
        new_theta: 0.98,
      },
      {
        qid: 13,
        answer: "Define the problem state and the initial state.",
        a: 0.95,
        b: 1.32,
        c: -0.88,
        subtopic: 284667,
        new_theta: -0.18,
      },
      {
        qid: 14,
        answer: "Exponential",
        a: -0.17,
        b: 0.14,
        c: 0.33,
        subtopic: 284712,
        new_theta: 1.4,
      },
      {
        qid: 15,
        answer:
          "A problem where the solution must satisfy a set of constraints.",
        a: 0.91,
        b: 1.26,
        c: -0.89,
        subtopic: 284793,
        new_theta: -0.91,
      },
      {
        qid: 16,
        answer: "Define the problem state and the initial state.",
        a: 0.13,
        b: 0.59,
        c: 0.42,
        subtopic: 285295,
        new_theta: -1.25,
      },
      {
        qid: 17,
        answer: "Exponential",
        a: -0.22,
        b: 0.2,
        c: 0.4,
        subtopic: 285169,
        new_theta: 2.4,
      },
      {
        qid: 18,
        answer: "Linear",
        a: 0.82,
        b: 1.15,
        c: -0.75,
        subtopic: 285031,
        new_theta: -0.88,
      },
      {
        qid: 19,
        answer: "Define the problem state and the initial state.",
        a: -0.18,
        b: 0.11,
        c: 0.27,
        subtopic: 284667,
        new_theta: -1.18,
      },
      {
        qid: 20,
        answer: "Exponential",
        a: 0.97,
        b: 1.28,
        c: -0.93,
        subtopic: 284712,
        new_theta: 0.98,
      },
    ],
    subtopic: {
      284667: {
        old_theta: 0.1,
        history: { correct: 5, total: 15, theta: 0.18 }, // new theta
        info: { name: "Artificial Intelligence", sst_name: "ai-intelligence" },
      },
      284712: {
        old_theta: 0.33,
        history: { correct: 4, total: 14, theta: 0.33 },
        info: {
          name: "Foundations of AI: Logic",
          sst_name: "foundations-ai",
        },
      },
      284793: {
        old_theta: 0.8,
        history: { correct: 3, total: 10, theta: 0.98 },
        info: { name: "Game Theory", sst_name: "game-theory" },
      },
      285295: {
        old_theta: -1.15,
        history: { correct: 1, total: 5, theta: -0.15 },
        info: {
          name: "Machine Learning Basics",
          sst_name: "ml-basics",
        },
      },
      285169: {
        old_theta: -1.2,
        history: { correct: 2, total: 6, theta: -0.35 },
        info: { name: "Search Algorithms", sst_name: "search-algorithms" },
      },
      285031: {
        old_theta: 1.5,
        history: { correct: 1, total: 4, theta: -0.88 },
        info: { name: "Optimization Problems", sst_name: "optimization" },
      },
    },
  };

  return (
    <div className="mt-[20px]">
      <div
        style={{ width: "150px", height: "125px" }}
        className="mt-[20px] mx-auto"
      >
        <DoughnutChart data={data} />
      </div>

      <div
        style={{ width: "150px", height: "125px" }}
        className="mt-[20px] mx-auto"
      >
        <FullColorDoughnut
          label="Correct"
          data={10}
          insidetext="Correct"
          color={CHART_COLORS.green}
        />
      </div>

      <div
        style={{ width: "150px", height: "125px" }}
        className="mt-[20px] mx-auto"
      >
        <FullColorDoughnut
          label="Incorrect"
          data={20}
          insidetext="Incorrect"
          color={CHART_COLORS.red}
        />
      </div>

      <div
        style={{ width: "100%", height: "100%" }}
        className="mt-[20px] mx-auto"
      >
        <BarChartsBySubtopic data={data} />
      </div>

      <div
        style={{ width: "100%", height: "100%" }}
        className="mt-[20px] mx-auto"
      >
        <BubbleChart data={data} />
      </div>

      <div
        style={{ width: "100%", height: "100%" }}
        className="mt-[20px] mx-auto"
      >
        <QuizReport data={data} />
      </div>
    </div>
  );
}

export default Quiz;
