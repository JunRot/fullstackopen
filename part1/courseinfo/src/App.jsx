const Header = (props) => {
  console.log("Header props:", props.course.name)
  return <h2>{props.course.name}</h2>
}


const Part = (props) => {
  console.log("Part props: ", props)
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}


const Content = (props) => {
  console.log("Content props:", props)
  return (
    <div>
      <Part name={props.course.parts[0].name} exercises={props.course.parts[0].exercises} />
      <Part name={props.course.parts[1].name} exercises={props.course.parts[1].exercises} />
      <Part name={props.course.parts[2].name} exercises={props.course.parts[2].exercises} />
    </div>
  )
}


const Total = (props) => {
  console.log("Total props:", props)
  
  return (
    <p>
      Number of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises} + {props.course.parts[2].exercises}
    </p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  )
}

export default App