import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar'
import About from './components/About'
import Make from './components/Make'
import Take from './components/Take'
import IdPage from './components/IdPage'
import Quiz from './components/Quiz'
import NoQuiz from './components/NoQuiz'
import Result from './components/Result'


function App() {
  return (
    <Router>
    <div className = "App">
      <div className="title">
        <h1>Quahoot</h1>
      </div>
      <div className="firstLevel">
      <Sidebar />
      <div className="about">
        
          <Switch>
            <Route exact path = "/" component={About} />
            <Route path = "/make" component={Make} />
            <Route path = "/take" component={Take} />
            <Route path = "/IdPage/:id" component={IdPage} />
            <Route exact path = "/Quiz" component={Quiz}/>
            <Route exact path = "/NoQuiz" component={NoQuiz} />
            <Route path = "/Result/:first/:second/:third/:place" component={Result} /> 
          </Switch>
          </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
