'use strict'

import React from 'react'
import {
  AppRegistry,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import { createResponder } from 'react-native-gesture-responder'
import * as force from 'd3-force'
import _ from 'underscore'

const d3 = {
  force
}

export default function (platform) {
  let main = React.createClass({
    getInitialState() {
      return {
        nodes: null,
        dimensions: { width: 0, height: 0 },
        focusPos: { x: 0, y: 0 },
        offsetPos: { x: 0, y: 0 },
        zoom: 1.0,
      }
    },
    componentWillMount() {
      this.updateHashtags(this.props, this.state)
      this.gestureResponder = createResponder({
        onStartShouldSetResponder: (evt, gestureState) => true,
        onStartShouldSetResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetResponder: (evt, gestureState) => true,
        onMoveShouldSetResponderCapture: (evt, gestureState) => false,
        onResponderMove: (evt, gestureState) => {
          if (gestureState.pinch && gestureState.previousPinch) {
            let new_zoom = this.state.zoom * gestureState.pinch / gestureState.previousPinch
            new_zoom = Math.min(2, Math.max(0.5, new_zoom))
            this.setState({
              zoom: new_zoom
            })
          }
          else {
            this.setState({
              offsetPos: { x: gestureState.dx, y: gestureState.dy }
            })
          }
        },
        onResponderRelease: (evt, gestureState) => {
          this.setState({
            focusPos: {
              x: this.state.focusPos.x + this.state.offsetPos.x,
              y: this.state.focusPos.y + this.state.offsetPos.y
            },
            offsetPos: { x: 0, y: 0 },
          })
        }
      })
    },
    updateHashtags(props, state) {
      var hashtags = []
      for (var i = 0; i < 100; ++i) {
        hashtags.push({
          id: i + 1,
          name: 'text',
        })
      }
      hashtags = hashtags
        .map((p, index) => {
          var radius
          if (index < 1) {
            radius = 40
          }
          else if (index < 2) {
            radius = 35
          }
          else if (index < 3) {
            radius = 30
          }
          else if (index < 10) {
            radius = 25
          }
          else if (index < 25) {
            radius = 18
          }
          else if (index < 50) {
            radius = 13
          }
          else if (index < 75) {
            radius = 10
          }
          else {
            radius = 5
          }
          return _.extend(p, {
            radius: radius / 3,
            x: NaN,
            y: NaN,
          })
        })
      this.simulation = d3.force.forceSimulation(hashtags)
        .velocityDecay(0.4)
        .force("center", d3.force.forceCenter())
        .force("x", d3.force.forceX().strength(0.02))
        .force("y", d3.force.forceY().strength(0.02))
        .force("collide", d3.force.forceCollide().radius(function (d) { return d.radius + 2 }))
        .stop()
      this.setState({
        nodes: this.simulation.nodes()
      }, this._onNextTick)
    },
    _onNextTick() {
      this.simulation.tick()
      this.setState({
        nodes: this.simulation.nodes()
      })
      setTimeout(this._onNextTick, 0)
    },
    handleLayout(e) {
      let { width, height } = e.nativeEvent.layout
      this.setState({
        dimensions: { width, height }
      })
    },
    render() {
      var hashtags = this.state.nodes
      if (hashtags.length > 0) {
        var { width, height } = this.state.dimensions
        if (width !== 0 && height !== 0) {
          var nodes = hashtags.map((data, idx) => {
            var scale = ((width + height) / 300.0) * (this.state.zoom * 2.0)
            var radius = data.radius * scale
            var x = data.x * scale + this.state.focusPos.x + this.state.offsetPos.x
            var y = data.y * scale + this.state.focusPos.y + this.state.offsetPos.y
            var color = data.color
            return (
              <View
                key={data.id}
                style={{
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  transform: [
                    { translateX: width / 2 - 100 + x },
                    { translateY: height / 2 - 100 + y },
                    { scale: radius / 100 },
                  ]
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                  }}>
                  <Text
                    style={{
                      fontSize: 44,
                      fontWeight: 'bold',
                      color: 'black',
                      padding: 20,
                      backgroundColor: 'transparent'
                    }} numberOfLines={2}>{data.name}</Text>
                </View>
              </View>
            )
          })
        }
      }
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'rgb(241,241,241)',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgb(51,51,51)',
              overflow: 'hidden'
            }}
            onLayout={this.handleLayout}
            {...this.gestureResponder}>
            {nodes}
          </View>
        </View>
      )
    },
  })

  AppRegistry.registerComponent('bubble', () => main)

  return main
}