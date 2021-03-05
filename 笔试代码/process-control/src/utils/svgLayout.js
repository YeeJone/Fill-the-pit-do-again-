const createNodeColumns = stages => {
  const nodeColumns = []

  for (const topStage of stages) {
    const stagesForColumn = topStage.jobs && topStage.jobs.length ? topStage.jobs : [topStage]

    const column = {
      topStage,
      rows: [],
      centerX: 0, 
      startX: 0,
    }

    for (const firstStageForRow of stagesForColumn) {
      const rowNodes = []
      let nodeStage = firstStageForRow

      while (nodeStage) {
        rowNodes.push({
          x: 0, 
          y: 0,
          name: nodeStage.name,
          stage: nodeStage
        })
        nodeStage = nodeStage.nextSibling
      }
      column.rows.push(rowNodes)
    }

    nodeColumns.push(column)
  }

  return nodeColumns
}

function positionNodes(nodeColumns, { stageWidth, parallelSpacingH, nodeSpacingV, initTop }) {
  let xp = stageWidth / 2
  let previousTopNode

  for (const column of nodeColumns) {
    const topNode = column.rows[0][0]

    let yp = initTop

    if (previousTopNode) {
      xp += stageWidth
    }

    let widestRow = 0
    for (const row of column.rows) {
      widestRow = Math.max(widestRow, row.length)
    }

    const xpStart = xp

    let maxX = xp

    for (const row of column.rows) {
      let nodeX = xp

      nodeX += Math.round((widestRow - row.length) * parallelSpacingH * 0.5)

      for (const node of row) {
          maxX = Math.max(maxX, nodeX)
          node.x = nodeX
          node.y = yp
          nodeX += parallelSpacingH
      }

      yp += nodeSpacingV
    }

    column.centerX = Math.round((xpStart + maxX) / 2)
    column.startX = xpStart 
    xp = maxX

    previousTopNode = topNode
  }
}

function createStages(columns) {
  const labels= []

  for (const column of columns) {
    const node = column.rows[0][0]
    const stage = column.topStage
    const text = stage ? stage.title : node.title

    let x = column.centerX

    labels.push({
        x,
        y: node.y,
        node,
        stage,
        text,
    })
  }

  return labels
}

function createJobs(columns) {
  const labels = []

  for (const column of columns) {
    for (const row of column.rows) {
      for (const node of row) {
        if (node.stage === column.topStage) {
          continue
        }
        const label = {
          x: node.x,
          y: node.y,
          text: node.name,
          node,
        }

        label.stage = node.stage

        labels.push(label)
      }
    }
  }

  return labels
}

function createConnections(columns){
  const connections = []

  let sourceNodes = []

  for (const column of columns) {
    if (sourceNodes.length) {
      connections.push({
          sourceNodes,
          destinationNodes: column.rows.map(row => row[0])
      })
    }

    for (const row of column.rows) {
      for (let i = 0; i < row.length - 1; i++) {
        connections.push({
            sourceNodes: [row[i]],
            destinationNodes: [row[i + 1]]
        })
      }
    }

    sourceNodes = column.rows.map(row => row[row.length - 1])
  }

  return connections
}

export const computeLayoutInfo = (newStages, layout) => {
  const stageNodeColumns = createNodeColumns(newStages)
  const { stageWidth, initTop } = layout

  positionNodes(stageNodeColumns, layout)

  const stages = createStages(stageNodeColumns)
  const jobs = createJobs(stageNodeColumns)
  const connections = createConnections(stageNodeColumns)

  let svgWidth = 0
  let svgHeight = 200

  for (const column of stageNodeColumns) {
    for (const row of column.rows) {
      for (const node of row) {
        svgWidth = Math.max(svgWidth, node.x + stageWidth / 2)
        svgHeight = Math.max(svgHeight, node.y + initTop)
      }
    }
  }

  return {
    connections,
    stages,
    jobs,
    svgWidth,
    svgHeight,
  }
}

export function getSvgCurve(x1, y1, x2, y2, midPointX, curveRadius) {
  const verticalDirection = Math.sign(y2 - y1) 
  const w1 = midPointX - curveRadius - x1 + curveRadius * verticalDirection
  const w2 = x2 - curveRadius - midPointX - curveRadius * verticalDirection
  const v = y2 - y1 - 2 * curveRadius * verticalDirection 
  const cv = verticalDirection * curveRadius

  return (
    ` l ${w1} 0` + // 第一条横线
    ` c ${curveRadius} 0 ${curveRadius} ${cv} ${curveRadius} ${cv}` + // 拐角
    ` l 0 ${v}` + // 竖线
    ` c 0 ${cv} ${curveRadius} ${cv} ${curveRadius} ${cv}` + // 拐角
    ` l ${w2} 0` // 第二条横线
  )
}

export function connectorKey(leftNode, rightNode) {
  return 'form_' + leftNode.name + '_to_' + rightNode.name
}