import React from 'react'
import Form from '../../components/Form/Form'
import Table from '../../components/Table/Table'
import "./Home.css"
import Hero from '../../components/Hero/Hero'

function Home() {
  return (
    <div className='Home'>
      <Hero />
      <Form />
      <Table />
    </div>
  )
}

export default Home
