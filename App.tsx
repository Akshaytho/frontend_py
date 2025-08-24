import React from 'react';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';
import { AuthProvider, useAuth } from './auth';

const InnerApp: React.FC = () => {
  const { account, signIn, signOut } = useAuth();
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Agentic RAG Demo</h1>
        <div>
          {account ? (
            <>
              <span style={{ marginRight: '8px' }}>Hello, {account.account?.username}</span>
              <button onClick={signOut}>Sign out</button>
            </>
          ) : (
            <button onClick={signIn}>Sign in</button>
          )}
        </div>
      </header>
      <p>
        This interface allows you to upload documents for ingestion and ask questions
        against the indexed content.  The backend uses Azure OpenAI embeddings and
        Azure Cognitive Search to retrieve relevant passages before generating
        answers.
      </p>
      <FileUpload />
      <hr />
      <Chat />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <InnerApp />
  </AuthProvider>
);

export default App;