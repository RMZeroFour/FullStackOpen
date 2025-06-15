function Header(props) {
    return <h1>{props.course.name}</h1>;
}

function Part(props) {
    return <p>{props.name} {props.count}</p>;
}

function Content(props) {
    return (
	<>
	    <Part name={props.course.parts[0].name} count={props.course.parts[0].exercises} />
	    <Part name={props.course.parts[1].name} count={props.course.parts[1].exercises} />
	    <Part name={props.course.parts[2].name} count={props.course.parts[2].exercises} />
        </>
    );
}

function Footer(props) {
    return <p>Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}</p>;
}

function App() {
    const course = {
	name: 'Half Stack application development',
	parts: [
	    {
		name: 'Fundamentals of React',
		exercises: 10,
	    },
    	    {
		name: 'Using props to pass data',
		exercises: 7,
	    },
            { 
		name: 'State of a component', 
		exercises: 14,
	    },
	],
    };

    return (
	<>
	    <Header course={course} />
	    <Content course={course}/>
	    <Footer course={course}/>
	</>
    );
}

export default App;
