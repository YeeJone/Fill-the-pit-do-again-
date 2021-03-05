import React from 'react'
import PropTypes from 'prop-types'

import {getLocalTimeString} from '../utils/time'
import {statusToImg} from '../constants'

import './Job.css'

const Job = ({ data, style }) => {
  const { name, status, time } = data || {}

  return (
    <div className='Job-root' style={style}>
      <div className='Job-content'>
        <img className='Job-icon' src={statusToImg[status]} alt='icon' />
        <span>{name}</span>
      </div>
      <div>{getLocalTimeString(time)}</div>
    </div>
  )
}

Job.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object
}

export default Job