import { useState } from 'react'

const max = 8;
const gen_randomNum = () => Math.floor(Math.random() * max);
const voteArray = Array(max).fill(0);

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(voteArray);
  console.log(votes);

  const clickVote = (props) => {
    const copy = [...votes];
    copy[props] += 1;
    setVotes(copy);
  }

  // Check the highest vote
  let temp = votes[0];
  let highest_vote = 0;
  for (let i = 0; i < max; i++) {
    if (temp < votes[i]) {
      temp = votes[i];
      highest_vote = i;
    }
  };
  console.log(highest_vote);
  
  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <br></br>
      <button onClick={() => clickVote(selected)}>vote</button>
      <button onClick={() => setSelected(gen_randomNum)}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      {anecdotes[highest_vote]}
    </div>
  )
}

export default App