import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick} >
      {text}
    </button>
  )
};

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td> {text} </td>
    <td> {value} </td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100
  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={average.toFixed(2)} />
        <StatisticsLine text="positive" value={positive.toFixed(2) + "%"} />
      </tbody>
    </table>
  )
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const Renderpage = ({ good, neutral, bad }) => {
    if (good === 0 && neutral === 0 && bad === 0) {
      return (
        <div> No feed back given </div>
      )
    }
    return (
      <div>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    )
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <h2>statistics</h2>
      <Renderpage good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App