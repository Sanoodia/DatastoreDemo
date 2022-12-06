import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard';
import awsconfig from "./aws-exports";
import { Amplify } from 'aws-amplify';

try {
  Amplify.configure(awsconfig?.default ?? awsconfig);
} catch (err) {
  console.log("Appologies Unable to configure Amplify");
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Dashboard/>
      </header>
      
    </div>
  );
}

export default App;
