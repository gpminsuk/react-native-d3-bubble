'use strict'

import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'

import {
  Router,
  Scene,
  Actions,
  ActionConst,
  Modal
} from 'react-native-router-flux'

import * as force from 'd3-force'

const d3 = {
  force
}

export default function (platform) {
  let Polipan = React.createClass({
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
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                  }}
                  onPress={() => this.handlePressHashtag(data)}>
                  <Text
                    style={{
                      fontSize: 44,
                      fontWeight: 'bold',
                      color: 'black',
                      padding: 20,
                      backgroundColor: 'transparent'
                    }} numberOfLines={2}>{data.name}</Text>
                </TouchableOpacity>
                {
                  idx < 3 &&
                  <View
                    style={{
                      position: 'absolute',
                      top: 155,
                      left: 155,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 2,
                      borderColor: 'black',
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}>
                    <Text style={[Stylesheet.text_bold]}>{idx + 1}위</Text>
                  </View>
                }
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
              overflow: 'hidden',
              marginTop: this.props.platform === 'ios' ? 70 : 50
            }}
            onLayout={this.handleLayout}
            {...this.gestureResponder}>
            {nodes}
          </View>
          }
        </View>
      )
    },
  })

  AppRegistry.registerComponent('polipanclient', () => Polipan)

  return Polipan
}