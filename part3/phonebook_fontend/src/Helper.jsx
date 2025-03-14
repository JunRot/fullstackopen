const Header = (props) => <h3>{props.course}</h3>;

const Content = (props) => (
    <div>
      {props.parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => (
  <strong>
    <p>
      Total of {props.total.reduce((acc, part) => acc + part.exercises,0)} exercises
    </p>
  </strong>
)

const Course = (props) => {
  console.log(props.courses)
return (
  <div>
    <Header course={props.courses.name} />
    <Content parts={props.courses.parts} />
    <Total total={props.courses.parts}/>
  </div>
  )
}

export default Course