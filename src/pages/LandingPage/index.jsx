import { Button } from '@mantine/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './landingpage.scss'

function LandingPage() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate('/login')
  }

  return (
    <div className='main-wrapper'>
      <div className='main-container'>
        <div className='dt-container'>
          <img src={'./upgrade_white.svg'} alt="" />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <Button onClick={() => goToLogin()} className='get_started' size='md' uppercase>Get Started</Button>
        </div>
    </div>
    </div>
  )
}

export default LandingPage