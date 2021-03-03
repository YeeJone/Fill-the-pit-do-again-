import React, {useState} from 'react'
import PropTypes from 'prop-types'

import useCounter from '../hooks/useCounter'
import {getLocalTimeString} from '../utils/time'

import css from './Job.css'

const Job = ({ name }) => {
  const [time, setTime] = useState(0)
  const [isPending, setIsPending] = useState(true)

  const delay = isPending ? 1000 : null

  useCounter(() => {
    setTime(time + 1000)
  }, delay)

  return (
    <div className='Job-root'>
      <div>
        <span>svg</span>
        <span>{name}</span>
      </div>
      <div>{getLocalTimeString(time)}</div>
    </div>
  )
}

Job.propTypes = {
  name: PropTypes.string.isRequired,
}

export default Job