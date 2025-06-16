function Header({ course }) {
    return <h2>{course.name}</h2>;
}

function Part({ name, count }) {
    return <p>{name} {count}</p>;
}

function Content({ course }) {
    return course.parts.map(part =>
	<Part key={part.id} name={part.name} count={part.exercises} />
    );
}

function Footer({ course }) {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p>Number of exercises {total}</p>;
}

function Course({ course }) {
    return (
	<>
	    <Header course={course} />
	    <Content course={course}/>
	    <Footer course={course}/>
	</>
    );
}

export default Course;
