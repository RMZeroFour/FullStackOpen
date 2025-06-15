import { useState } from 'react';

function Button({ text, onClick }) {
    return <button onClick={onClick}>{text}</button>;
}

function StatisticLine({ text, value }) {
    return (
	<tr>
	    <td>{text}</td>
	    <td>{value}</td>
	</tr>
    );
}

function Statistics({ good, neutral, bad }) {
    const all = good + neutral + bad;
    if (all === 0) {
	return <p>No feedback given</p>;
    }
    return (
	<table>
	    <tbody>
	        <StatisticLine text='good' value={good} />
	        <StatisticLine text='neutral' value={neutral} />
	    	<StatisticLine text='bad' value={bad} />
		<StatisticLine text='all' value={all} />
	    	<StatisticLine text='average' value={(good - bad) / all} />
	    	<StatisticLine text='positive' value={good * 100 / all} />
	    </tbody>
	</table>
    );
}

function App() {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const all = good + neutral + bad;

    function handleGoodClicked() {
	setGood(good + 1); 
    }
    function handleNeutralClicked() {
	setNeutral(neutral + 1); 
    }
    function handleBadClicked() {
	setBad(bad + 1); 
    }

    return (
        <>
      	    <h1>give feedback</h1>
	    <div>
	    	<Button text='good' onClick={handleGoodClicked} />
	    	<Button text='neutral' onClick={handleNeutralClicked} />
	    	<Button text='bad' onClick={handleBadClicked} />
	    </div>
	    <h1>statistics</h1>
	    <Statistics good={good} neutral={neutral} bad={bad} />
        </>
    )
}

export default App;
