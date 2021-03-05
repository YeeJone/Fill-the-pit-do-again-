import React from 'react'
import Job from './Job'
import {computeLayoutInfo, getSvgCurve, connectorKey} from '../utils/svgLayout'
import {defaultLayoutInfo, nodeStrokeWidth} from '../constants'

import './Pipeline.css'

const Pipeline = ({ data }) => {
  const svgElements = []
  const {connections, stages, jobs, svgWidth, svgHeight} = computeLayoutInfo(data, defaultLayoutInfo)

  const renderStageTitle = stageDetails => {
    const { stageWidth, initTop } = defaultLayoutInfo

    const stageHeight = initTop - 30
    const stageOffsetH = Math.floor(stageWidth / -2)

    const stageTitleStyle = {
        position: 'absolute',
        width: stageWidth,
        maxHeight: stageHeight + 'px',
        marginLeft: stageOffsetH,
    }

    const x = stageDetails.x
    const bottom = svgHeight - stageDetails.y + 30

    const style = {
      ...stageTitleStyle,
      bottom: bottom + 'px',
      left: x + 'px',
    }

    return (
      <div className='Pipeline-stage' style={style} key={stageDetails.name}>
        {stageDetails.text}
      </div>
    )
  }

  const renderJobs = jobDetails => {
    const { jobWidth } = defaultLayoutInfo

    const x = jobDetails.x - jobWidth / 2
    const top = jobDetails.y - 15 // job 高度一半 30 / 2

    const style = {
      top: top,
      left: x,
      position: 'absolute',
      width: jobWidth
    }

    return (<Job style={style} data={jobDetails.stage} key={jobDetails.name} />)
}

  const renderHorizontalLine = (leftNode, rightNode, connectorStroke, svgElements) => {
    const { jobWidth } = defaultLayoutInfo

    const key = connectorKey(leftNode, rightNode)

    const x1 = leftNode.x + jobWidth / 2 - nodeStrokeWidth / 2
    const x2 = rightNode.x - jobWidth / 2 + nodeStrokeWidth / 2
    const y = leftNode.y

    svgElements.push(<line {...connectorStroke} key={key} x1={x1} y1={y} x2={x2} y2={y} />)
  }

  const renderBasicCurvedPath = (leftNode, rightNode, midPointX, svgElements) => {
    const { curveRadius, connectorStrokeWidth, jobWidth } = defaultLayoutInfo
    const key = connectorKey(leftNode, rightNode)

    const left = {
      x: leftNode.x + jobWidth / 2 - nodeStrokeWidth / 2,
      y: leftNode.y,
    }

    const right = {
      x: rightNode.x - jobWidth / 2 + nodeStrokeWidth / 2,
      y: rightNode.y,
    }

    const connectorStroke = {
        className: 'Pipeline-connector',
        strokeWidth: connectorStrokeWidth,
    }

    const pathData = `M ${left.x} ${left.y}` + getSvgCurve(left.x, left.y, right.x, right.y, midPointX, curveRadius)

    svgElements.push(<path {...connectorStroke} key={key} d={pathData} fill="none" />)
  }

  const renderBasicConnections = (sourceNodes, destinationNodes, svgElements) => {
    const { connectorStrokeWidth, stageWidth } = defaultLayoutInfo
    const halfSpacingH = stageWidth / 2

    const connectorStroke = {
      className: 'Pipeline-connector',
      strokeWidth: connectorStrokeWidth,
    }

    renderHorizontalLine(sourceNodes[0], destinationNodes[0], connectorStroke, svgElements)

    if (sourceNodes.length === 1 && destinationNodes.length === 1) {
      return
    }

    let rightmostSource = sourceNodes[0].x
    let leftmostDestination = destinationNodes[0].x

    for (let i = 1; i < sourceNodes.length; i++) {
      rightmostSource = Math.max(rightmostSource, sourceNodes[i].x)
    }

    for (let i = 1; i < destinationNodes.length; i++) {
      leftmostDestination = Math.min(leftmostDestination, destinationNodes[i].x)
    }

    const collapseMidPointX = Math.round(rightmostSource + halfSpacingH)
    for (const previousNode of sourceNodes.slice(1)) {
      renderBasicCurvedPath(previousNode, destinationNodes[0], collapseMidPointX, svgElements)
    }

    let expandMidPointX = Math.round(leftmostDestination - halfSpacingH)

    for (const destNode of destinationNodes.slice(1)) {
      renderBasicCurvedPath(sourceNodes[0], destNode, expandMidPointX, svgElements)
    }
  }

  connections.forEach(connection => {
    const { sourceNodes, destinationNodes } = connection
    renderBasicConnections(sourceNodes, destinationNodes, svgElements)
  })

  return (
    <div className='Pipeline-root'>
      <div className='Pipeline-pipelineGraph'>
        <svg width={svgWidth} height={svgHeight}>
          {svgElements}
        </svg>
        {stages.map(stage => renderStageTitle(stage))}
        {jobs.map(job => renderJobs(job))}
      </div>
    </div>
  )
}

export default Pipeline