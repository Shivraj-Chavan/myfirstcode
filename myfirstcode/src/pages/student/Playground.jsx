import PageHeader from "../../components/shared/PageHeader.jsx";
import CodeRunner from "../../components/shared/CodeRunner.jsx";

const STARTER = `print("Hello, myFirstCode!")`;

export default function Playground() {
  return (
    <div>
      <PageHeader
        eyebrow="student/playground"
        title="Code Playground"
        subtitle="A free space to test ideas before you use them in an assignment."
      />
      <CodeRunner initialCode={STARTER} initialLanguage="python" height="h-96" />
    </div>
  );
}
