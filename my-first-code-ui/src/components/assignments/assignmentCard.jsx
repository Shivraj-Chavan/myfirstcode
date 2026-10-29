import { useState } from "react";

export default function AssignmentCard({

  onSubmit,
  onClose

}) {

  const [form, setForm] =
    useState({

      title: "",

      description: "",

      standard: "6th",

      language: "javascript",

      categoryId: "",

      difficulty: "easy",

      starter_code: "",

      solution_code: "",

      expected_output: "",

      marks: 10,

      hints: [""],

      test_case: [
        {
          input: "",
          output: "",
        },
      ],
    });

  // ================= HANDLE CHANGE =================

  const handleChange = (
    e
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  // ================= HINT =================

  const handleHintChange = (
    index,
    value
  ) => {

    const updated =
      [...form.hints];

    updated[index] = value;

    setForm({
      ...form,
      hints: updated,
    });
  };

  const addHint = () => {

    setForm({

      ...form,

      hints: [
        ...form.hints,
        "",
      ],
    });
  };

  // ================= TEST CASE =================

  const handleTestCaseChange =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...form.test_case];

      updated[index][field] =
        value;

      setForm({

        ...form,

        test_case:
          updated,
      });
    };

  const addTestCase = () => {

    setForm({

      ...form,

      test_case: [

        ...form.test_case,

        {
          input: "",
          output: "",
        },
      ],
    });
  };

  // ================= SUBMIT =================
const handleSubmit =
  async () => {

    try {

      await onSubmit(form);

      onClose();

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      p-4
    "
    >

      <div
        className="
        bg-white
        w-full
        max-w-5xl
        rounded-3xl
        shadow-2xl
        overflow-hidden
      "
      >

        {/* HEADER */}

        <div
          className="
          flex
          items-center
          justify-between
          border-b
          px-6
          py-4
        "
        >

          <div>

            <h2
              className="
              text-2xl
              font-bold
            "
            >
              Create Assignment
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              mt-1
            "
            >
              Build coding tasks
              for students
            </p>

          </div>

          <button

            onClick={onClose}

            className="
            text-2xl
            text-gray-500
            hover:text-black
          "
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div
          className="
          p-6
          max-h-[80vh]
          overflow-y-auto
        "
        >

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
          >

            {/* TITLE */}

            <div>

              <label>
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Assignment title"
                className="input"
              />

            </div>

            {/* STANDARD */}

            <div>

              <label>
                Standard
              </label>

              <select
                name="standard"
                value={form.standard}
                onChange={handleChange}
                className="input"
              >

                <option>
                  6th
                </option>

                <option>
                  7th
                </option>

                <option>
                  8th
                </option>

              </select>

            </div>

            {/* LANGUAGE */}

            <div>

              <label>
                Language
              </label>

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="input"
              >

                <option>
                  javascript
                </option>

                <option>
                  python
                </option>

                <option>
                  c
                </option>

                <option>
                  html
                </option>

                <option>
                  css
                </option>

              </select>

            </div>

            {/* DIFFICULTY */}

         {/* CATEGORY */}

<div>

  <label>
    Category
  </label>

  <select
    name="categoryId"
    value={form.categoryId}
    onChange={handleChange}
    className="input"
  >

    <option value="">
      Select Category
    </option>

    <option value="variables">
      Variables
    </option>

    <option value="loops">
      Loops
    </option>

    <option value="arrays">
      Arrays
    </option>

    <option value="functions">
      Functions
    </option>

    <option value="flexbox">
      Flexbox
    </option>

    <option value="forms">
      Forms
    </option>

  </select>

</div>

{/* DIFFICULTY */}

<div>

  <label>
    Difficulty
  </label>

  <select
    name="difficulty"
    value={form.difficulty}
    onChange={handleChange}
    className="input"
  >

    <option>
      easy
    </option>

    <option>
      medium
    </option>

    <option>
      hard
    </option>

  </select>

</div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

            <label>
              Description
            </label>

            <textarea

              rows={4}

              name="description"

              value={form.description}

              onChange={handleChange}

              placeholder="Assignment description"

              className="input"
            />

          </div>

          {/* STARTER CODE */}

          <div className="mt-5">

            <label>
              Starter Code
            </label>

            <textarea

              rows={5}

              name="starter_code"

              value={form.starter_code}

              onChange={handleChange}

              placeholder="Starter code"

              className="input font-mono"
            />

          </div>

          {/* SOLUTION CODE */}

          <div className="mt-5">

            <label>
              Solution Code
            </label>

            <textarea

              rows={5}

              name="solution_code"

              value={form.solution_code}

              onChange={handleChange}

              placeholder="Correct solution"

              className="input font-mono"
            />

          </div>

          {/* OUTPUT */}

          <div className="mt-5">

            <label>
              Expected Output
            </label>

            <textarea

              rows={3}

              name="expected_output"

              value={
                form.expected_output
              }

              onChange={handleChange}

              placeholder="Expected output"

              className="input"
            />

          </div>

          {/* MARKS */}

          <div className="mt-5">

            <label>
              Marks
            </label>

            <input

              type="number"

              name="marks"

              value={form.marks}

              onChange={handleChange}

              className="input"
            />

          </div>

          {/* HINTS */}

          <div className="mt-6">

            <div
              className="
              flex
              items-center
              justify-between
              mb-3
            "
            >

              <h3
                className="
                font-semibold
                text-lg
              "
              >
                Hints
              </h3>

              <button

                 type="button"
                onClick={addHint}

                className="
                px-4
                py-2
                bg-black
                text-white
                rounded-xl
                text-sm
              "
              >

                Add Hint

              </button>

            </div>

            {
              form.hints.map(
                (hint, index) => (

                  <input

                    key={index}

                    value={hint}

                    onChange={(e) =>
                      handleHintChange(
                        index,
                        e.target.value
                      )
                    }

                    placeholder={`Hint ${
                      index + 1
                    }`}

                    className="
                    input
                    mb-3
                  "
                  />
                )
              )
            }

          </div>

          {/* TEST CASES */}

          <div className="mt-6">

            <div
              className="
              flex
              items-center
              justify-between
              mb-3
            "
            >

              <h3
                className="
                font-semibold
                text-lg
              "
              >
                Test Cases
              </h3>

              <button
                 type="button"
                onClick={addTestCase}

                className="
                px-4
                py-2
                bg-black
                text-white
                rounded-xl
                text-sm
              "
              >

                Add Case

              </button>

            </div>

            {
              form.test_case.map(
                (test, index) => (

                  <div
                    key={index}

                    className="
                    border
                    rounded-2xl
                    p-4
                    mb-4
                  "
                  >

                    <input

                      value={test.input}

                      onChange={(e) =>
                        handleTestCaseChange(
                          index,
                          "input",
                          e.target.value
                        )
                      }

                      placeholder="Input"

                      className="
                      input
                      mb-3
                    "
                    />

                    <input

                      value={test.output}

                      onChange={(e) =>
                        handleTestCaseChange(
                          index,
                          "output",
                          e.target.value
                        )
                      }

                      placeholder="Output"

                      className="input"
                    />

                  </div>
                )
              )
            }

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
          border-t
          p-5
          flex
          justify-end
          gap-3
        "
        >

          <button

            onClick={onClose}

            className="
            px-5
            py-2.5
            border
            rounded-xl
          "
          >

            Cancel

          </button>

          <button

            onClick={handleSubmit}

            className="
            px-6
            py-2.5
            bg-black
            text-white
            rounded-xl
          "
          >

            Create Assignment

          </button>

        </div>

      </div>

      {/* CATEGORY */}

<div>

  <label>
    Category
  </label>

  <select
    name="categoryId"
    value={form.categoryId}
    onChange={handleChange}
    className="input"
  >

    <option value="">
      Select Category
    </option>

    <option value="variables">
      Variables
    </option>

    <option value="loops">
      Loops
    </option>

    <option value="arrays">
      Arrays
    </option>

    <option value="functions">
      Functions
    </option>

    <option value="flexbox">
      Flexbox
    </option>

    <option value="forms">
      Forms
    </option>

  </select>

</div>

    </div>
  );
}