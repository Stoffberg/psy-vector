import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import SidebarLayout from "~/layouts/SidebarLayout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const conversationId = router.query.id as string;

  const [question, setQuestion] = useState("");

  const { data: conversationEntries } =
    api.conversation.getConversationEntries.useQuery({ conversationId });
  const askQuestion = api.conversation.askQuestion.useMutation();

  const utils = api.useContext();
  const handleAskQuestion = async () => {
    const result = await askQuestion.mutateAsync({
      question,
      conversationId,
    });

    // do a optimistic update
    utils.conversation.getConversationEntries.setData(
      { conversationId },
      (prev) => {
        if (!prev) return [result];
        return [...prev, result];
      }
    );

    // do a pessimistic update
    await utils.conversation.getConversationEntries.invalidate({
      conversationId,
    });
  };

  return (
    <SidebarLayout>
      <div className="flex h-full flex-col justify-end">
        <section id="content-section" className="relative h-full">
          <div className="absolute inset-0 space-y-4 overflow-y-auto">
            {conversationEntries?.map((entry) => (
              <div key={entry.id} className="space-y-4">
                <h1 className="card">
                  <b>User:</b> {entry.question}
                </h1>
                <p className="card">
                  <b>AI:</b> {entry.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
        <div className="flex gap-4">
          <input
            type="text"
            className="input"
            placeholder="Enter your question here.."
            onChange={(e) => setQuestion(e.currentTarget.value)}
            value={question}
          />
          <button className="btn-main" onClick={() => void handleAskQuestion()}>
            Ask Question
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Home;
