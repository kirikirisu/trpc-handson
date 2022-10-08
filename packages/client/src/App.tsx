import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./trpc";

import "./index.scss";

const client = new QueryClient();

const AppContent = () => {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const getMessages = trpc.useQuery(["getMessages"]);
  const addMessage = trpc.useMutation("addMessage");
  const onAdd = () => {
    addMessage.mutate(
      {
        message,
        user,
      },
      {
        onSuccess: () => {
          client.invalidateQueries(["getMessages"]);
        },
      }
    );
  };

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>{JSON.stringify(getMessages.data)}</div>
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="User"
        className="p-5 border-2 border-gray-300 rounded-lg w-full"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="p-5 border-2 border-gray-300 rounded-lg w-full"
      />
      <button onClick={onAdd}>Add message</button>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(
    trpc.createClient({ url: "http://localhost:8080/trpc" })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
