import { useEffect, useState } from "react";
import axios from "axios";

import {
  Clock3,
  Trophy,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import ENDPOINT from "../../lib/endpoints";

export default function StudentQuizzes() {

  // ============================================
  // STATES
  // ============================================

  const [quizzes, setQuizzes] =
    useState([]);

  const [selectedQuiz, setSelectedQuiz] =
    useState(null);

  const [answers, setAnswers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [reviewData, setReviewData] =
    useState([]);

  // ============================================
  // TOKEN
  // ============================================

  const token =
    localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ============================================
  // LOAD QUIZZES
  // ============================================

  const loadQuizzes = async () => {

    try {

      const res = await axios.get(
        ENDPOINT.GET_QUIZZES,
        authConfig
      );

      setQuizzes(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  // ============================================
  // OPEN QUIZ
  // ============================================

  const openQuiz = async (id) => {

    try {

      const res = await axios.get(
        ENDPOINT.GET_SINGLE_QUIZ(id),
        authConfig
      );

      setSelectedQuiz(res.data);

      setAnswers([]);

      setSubmitted(false);

      setResult(null);

      setReviewData([]);

    } catch (err) {

      console.log(err);

      alert("Failed to load quiz");

    }
  };

  // ============================================
  // HANDLE ANSWER
  // ============================================

  const handleAnswer = (
    questionId,
    selected
  ) => {

    setAnswers((prev) => {

      const exists =
        prev.find(
          (a) =>
            a.questionId === questionId
        );

      if (exists) {

        return prev.map((a) =>
          a.questionId === questionId
            ? {
                ...a,
                selected,
              }
            : a
        );
      }

      return [
        ...prev,
        {
          questionId,
          selected,
        },
      ];
    });
  };

  // ============================================
  // SUBMIT QUIZ
  // ============================================

  const handleSubmit = async () => {

    if (
      !window.confirm(
        "Submit quiz?"
      )
    ) {
      return;
    }

    try {

      setSubmitting(true);

      const payload = {

        answers: answers.map((a) => ({
          question_id:
            a.questionId,

          answer:
            a.selected,
        })),
      };

      const res =
        await axios.post(

          ENDPOINT.SUBMIT_QUIZ(
            selectedQuiz.quiz.id
          ),

          payload,

          authConfig
        );

      // =====================================
      // RESULT
      // =====================================

      const resultData =
        res.data.data;

      setResult(resultData);

      // =====================================
      // REVIEW DATA
      // =====================================

      const review =
        selectedQuiz.questions.map(
          (q) => {

            const studentAnswer =
              answers.find(
                (a) =>
                  a.questionId === q.id
              );

            return {
              ...q,
              selected:
                studentAnswer?.selected,
            };
          }
        );

      setReviewData(review);

      // =====================================
      // UPDATE QUIZ STATUS
      // =====================================

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id ===
          selectedQuiz.quiz.id
            ? {
                ...quiz,
                attempt_status:
                  "COMPLETED",

                last_result:
                  resultData,
              }
            : quiz
        )
      );

      setSubmitted(true);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data
          ?.message ||
          "Failed to submit quiz"
      );

    } finally {

      setSubmitting(false);

    }
  };

  // ============================================
  // EXIT QUIZ
  // ============================================

  const exitExam = () => {

    if (
      !submitted &&
      !window.confirm(
        "Exit exam? Progress will be lost."
      )
    ) {
      return;
    }

    setSelectedQuiz(null);

    setSubmitted(false);

    setResult(null);

    setAnswers([]);

    setReviewData([]);
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-gray-500
      ">
        <Loader2
          className="
            animate-spin
            mr-2
          "
        />
        Loading quizzes...
      </div>
    );
  }

  // ============================================
  // QUIZ LIST PAGE
  // ============================================

  if (!selectedQuiz) {

    return (

      <div className="
        min-h-screen
        bg-gray-50
        p-6
      ">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="
            text-3xl
            font-bold
            text-gray-900
          ">
            Student Quizzes
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Attempt quizzes and track progress
          </p>

        </div>

        {/* EMPTY */}

        {quizzes.length === 0 && (

          <div className="
            bg-white
            rounded-3xl
            p-10
            text-center
            text-gray-400
          ">
            No quizzes available
          </div>
        )}

        {/* QUIZ CARDS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {quizzes.map((quiz) => (

            <div
              key={quiz.id}
              className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                p-6
                shadow-sm
              "
            >

              {/* TOP */}

              <div className="
                flex
                items-start
                justify-between
                gap-3
              ">

                <div>

                  <h2 className="
                    text-lg
                    font-bold
                    text-gray-900
                  ">
                    {quiz.title}
                  </h2>

                  {quiz.standard && (
                    <p className="
                      text-xs
                      text-gray-500
                      mt-1
                    ">
                      Standard:
                      {" "}
                      {quiz.standard}
                    </p>
                  )}

                </div>

                {/* STATUS */}

                <div>

                 {quiz.attempt_status?.toUpperCase() ===
                  "COMPLETED" ? (

                    <span className="
                      bg-green-100
                      text-green-700
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      font-medium
                    ">
                      Completed
                    </span>

                  ) : (

                    <span className="
                      bg-yellow-100
                      text-yellow-700
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      font-medium
                    ">
                      Pending
                    </span>

                  )}

                </div>

              </div>

              {/* DESCRIPTION */}

              {quiz.description && (

                <p className="
                  text-sm
                  text-gray-500
                  mt-4
                  line-clamp-2
                ">
                  {quiz.description}
                </p>
              )}

              {/* INFO */}

              <div className="
                flex
                gap-5
                mt-5
                text-sm
                text-gray-500
              ">

                <div className="
                  flex
                  items-center
                  gap-1
                ">
                  <Clock3 size={15} />
                  {quiz.duration} mins
                </div>

                <div className="
                  flex
                  items-center
                  gap-1
                ">
                  <Trophy size={15} />
                  {quiz.total_marks} marks
                </div>

              </div>

              {/* RESULT */}

              {quiz.score !== null && (

                <div className="
  mt-5
  bg-gray-100
  rounded-2xl
  p-4
">

  <div className="
    flex
    items-center
    justify-between
  ">

    <div>

      <p className="
        text-xs
        text-gray-500
      ">
        Last Score
      </p>

      <h3 className="
        text-xl
        font-bold
        text-gray-900
      ">
        {quiz.score}
        /
        {quiz.total_marks}
      </h3>

      <p className="
        text-sm
        text-gray-500
        mt-1
      ">
        {quiz.percentage}%
      </p>

    </div>

    <div
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-medium

        ${
          quiz.result_status ===
          "Passed"
            ? `
              bg-green-100
              text-green-700
            `
            : `
              bg-red-100
              text-red-700
            `
        }
      `}
    >

      {quiz.result_status}

    </div>

  </div>

</div>
              )}

              {/* BUTTON */}

              <button
                onClick={() =>
                  openQuiz(quiz.id)
                }
                className="
                  w-full
                  mt-6
                  bg-gray-900
                  hover:bg-black
                  text-white
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300
                  font-medium
                "
              >

                {quiz.attempt_status ===
                "COMPLETED"
                  ? "Reattempt Quiz"
                  : "Start Quiz"}

              </button>

            </div>
          ))}

        </div>

      </div>
    );
  }

  // ============================================
  // QUIZ PAGE
  // ============================================

  return (

    <div className="
      min-h-screen
      bg-gray-50
      p-6
    ">

      <div className="
        max-w-4xl
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          items-start
          justify-between
          mb-8
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-gray-900
            ">
              {
                selectedQuiz.quiz.title
              }
            </h1>

            <p className="
              text-gray-500
              mt-2
            ">
              {
                selectedQuiz.quiz.description
              }
            </p>

          </div>

          <button
            onClick={exitExam}
            className="
              border
              border-gray-300
              px-5
              py-2
              rounded-xl
              hover:bg-gray-100
            "
          >
            Back
          </button>

        </div>

        {/* RESULT */}

        {submitted && result && (

          <div className="
            bg-gray-900
            text-white
            rounded-3xl
            p-6
            mb-8
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-6
            ">
              Quiz Result
            </h2>

            <div className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
            ">

              <div className="
                bg-white/10
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-300
                ">
                  Score
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  mt-2
                ">
                  {result.score}
                </h3>

              </div>

              <div className="
                bg-white/10
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-300
                ">
                  Percentage
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  mt-2
                ">
                  {result.percentage}%
                </h3>

              </div>

              <div className="
                bg-white/10
                rounded-2xl
                p-4
              ">

                <p className="
                  text-sm
                  text-gray-300
                ">
                  Attempt
                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  mt-2
                ">
                  #
                  {result.attempt_no}
                </h3>

              </div>

              <div
                className={`
                  rounded-2xl
                  p-4

                  ${
                    result.status ===
                    "Passed"
                      ? `
                        bg-green-500/20
                      `
                      : `
                        bg-red-500/20
                      `
                  }
                `}
              >

                <p className="
                  text-sm
                  text-gray-300
                ">
                  Status
                </p>

                <h3
                  className={`
                    text-2xl
                    font-bold
                    mt-2

                    ${
                      result.status ===
                      "Passed"
                        ? `
                          text-green-400
                        `
                        : `
                          text-red-400
                        `
                    }
                  `}
                >
                  {result.status}
                </h3>

              </div>

            </div>

          </div>
        )}

        {/* QUESTIONS */}

        <div className="space-y-6">

          {(submitted
            ? reviewData
            : selectedQuiz.questions
          ).map((q, index) => {

            const selectedOpt =
              answers.find(
                (a) =>
                  a.questionId === q.id
              )?.selected;

            const isCorrect =
              q.selected ===
              q.correct_answer;

            return (

              <div
                key={q.id}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-200
                  p-6
                "
              >

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  mb-5
                ">

                  <h3 className="
                    text-gray-900
                    font-semibold
                  ">
                    Q{index + 1}.
                    {" "}
                    {q.question}
                  </h3>

                  {submitted && (

                    isCorrect ? (

                      <CheckCircle2
                        className="
                          text-green-500
                          shrink-0
                        "
                      />

                    ) : (

                      <XCircle
                        className="
                          text-red-500
                          shrink-0
                        "
                      />
                    )
                  )}

                </div>

                <div className="
                  space-y-3
                ">

                  {["A", "B", "C", "D"].map(
                    (opt) => {

                      const text =
                        q[
                          `option_${opt.toLowerCase()}`
                        ];

                      const isSelected =
                        submitted
                          ? q.selected === opt
                          : selectedOpt === opt;

                      const isCorrectOption =
                        q.correct_answer === opt;

                      return (

                        <label
                          key={opt}
                          className={`
                            flex
                            items-center
                            gap-3
                            border
                            rounded-2xl
                            px-4
                            py-3
                            cursor-pointer
                            transition-all

                            ${
                              submitted
                                ? isCorrectOption
                                  ? `
                                    bg-green-50
                                    border-green-300
                                  `
                                  : isSelected
                                  ? `
                                    bg-red-50
                                    border-red-300
                                  `
                                  : `
                                    border-gray-200
                                  `
                                : isSelected
                                ? `
                                  bg-gray-900
                                  text-white
                                  border-gray-900
                                `
                                : `
                                  border-gray-200
                                  hover:bg-gray-50
                                `
                            }
                          `}
                        >

                          {!submitted && (

                            <input
                              type="radio"
                              checked={
                                isSelected
                              }
                              onChange={() =>
                                handleAnswer(
                                  q.id,
                                  opt
                                )
                              }
                              className="hidden"
                            />
                          )}

                          <span className="
                            font-semibold
                          ">
                            {opt}.
                          </span>

                          {text}

                        </label>
                      );
                    }
                  )}

                </div>

                {submitted && (

                  <div className="
                    mt-5
                    flex
                    gap-5
                    text-sm
                  ">

                    <p>
                      Your Answer:
                      {" "}
                      <span className="
                        font-semibold
                      ">
                        {q.selected ||
                          "Not Answered"}
                      </span>
                    </p>

                    <p>
                      Correct:
                      {" "}
                      <span className="
                        text-green-600
                        font-semibold
                      ">
                        {q.correct_answer}
                      </span>
                    </p>

                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* SUBMIT */}

        {!submitted && (

          <div className="
            mt-8
            flex
            gap-4
          ">

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="
                bg-gray-900
                hover:bg-black
                text-white
                px-8
                py-3
                rounded-2xl
                font-medium
                disabled:opacity-50
              "
            >

              {submitting
                ? "Submitting..."
                : "Submit Quiz"}

            </button>

            <button
              onClick={exitExam}
              className="
                border
                border-gray-300
                px-8
                py-3
                rounded-2xl
                hover:bg-gray-100
              "
            >
              Exit
            </button>

          </div>
        )}

      </div>

    </div>
  );
}