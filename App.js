import { StatusBar } from "expo-status-bar";
import ModalDropdown from "react-native-modal-dropdown";
import React, { Component } from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

class App extends Component {
  
  state = {
    modalVisible: true,
    whiteTimeSec: 59,
    whiteTimeMin: 0,
    whiteTimeHour: 0,
    whiteMoves: 0,
    whiteAve: 0,
    whitePaused: false,
    blackTimeSec: 59,
    blackTimeMin: 0,
    blackTimeHour: 0,
    blackMoves: 0,
    blackAve: 0,
    blackPaused: false,
    paused: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  paused =(which)=>{
    switch (which) {
      case 'white':
        this.setState({ whitePaused: true });
        break;
      case 'black':
        this.setState({ blackPaused: true });
        break;
      default:
        break;
    }
  }

  //mongo "mongodb+srv://sandbox.e0qtw.mongodb.net/myFirstDatabase" --username m001-student

  counts =(which)=> {
      switch (which) {
        case 'white':
          const countIntervalWhite = setInterval(()=>{
            this.state.whitePaused ? clearTimeout(countIntervalWhite) : this.setState({ whiteTimeSec: this.state.whiteTimeSec - 1})
            if (this.state.whiteTimeSec === 0) (this.setState({ whiteTimeSec: 59}) , this.setState({ whiteTimeMin: this.state.whiteTimeMin - 1}))
          },1000)
          break;
        case 'black':
          const countIntervalBlack = setInterval(()=>{
            this.state.blackPaused ? clearTimeout(countIntervalBlack) : this.setState({ blackTimeSec: this.state.blackTimeSec - 1})
            if (this.state.blackTimeSec === 0) (this.setState({ blackTimeSec: 59}) , this.setState({ blackTimeMin: this.state.blackTimeMin - 1}))
          },1000)
          break;
        default:
          break;
      }
  }

  blackPressed =()=>{
    //Count Moves
    this.setState({blackMoves: this.state.blackMoves + 1})
    //pause Black
    this.paused('black')
    //count White
    this.setState({ whitePaused: false });
    this.counts('white')
  }

  whitePressed =()=>{
    //Count Moves
    this.setState({whiteMoves: this.state.whiteMoves + 1})
    //Change Background Colors for both
    this.paused('white')
    //Continue Counting from Last Data
    this.setState({ blackPaused: false });
    this.counts('black')
  }

  less=(which)=>{
    switch (which) {
      case 'sec':
        this.state.blackTimeSec < 10 ? '0' : ''
        break;
    
      default:
        break;
    }
  }

  render() {
    const { modalVisible } = this.state;
    return (
      <View style={styles.mainContainer}>

        <View
            style={styles.blackTimer}>
          <Pressable onPress={()=>this.blackPressed()}>
            <Text style={styles.timeStyle}>{("0" + this.state.blackTimeHour).slice (-2)}:{("0" + this.state.blackTimeMin).slice (-2)}:{("0" + this.state.blackTimeSec).slice (-2)}</Text>
          </Pressable>
        </View>

        <View style={styles.statView}>
          <Text style={styles.stats}>Average Sec/Move {this.state.blackAve}</Text>
          <Text style={styles.stats}>{this.state.blackMoves} Moves</Text>
        </View>
        
        <View style={styles.centeredView}>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}
            >

            <View>
              <View style={styles.modalView}>

                <Text style={styles.modalHeader}>Settings</Text>
                <View style={styles.toLeft}>

                  <Text style={styles.modalSubHeader}>Timer Type</Text>
                  <ModalDropdown options={["Per Move","Per Player"]}/>

                  <Text style={styles.modalSubHeader}>Game Type</Text>
                  <ModalDropdown options={["Rapid","Blitz","Bullet"]}/>

                  <Text style={styles.modalSubHeader}>Move Duration</Text>
                  <ModalDropdown options={["1","2","3","4","5","10"]}/>

                  <Text style={styles.modalSubHeader}>Game Duration</Text>
                  <Text >Minute </Text>
                  <ModalDropdown options={["5","10","15","20","25","30","35","40","45","50","55"]}/>
                  <Text >Hour </Text>
                  <ModalDropdown options={["1","2","3","4","5"]}/>
                </View>

                <Pressable style={styles.button}>
                  <Text style={styles.textStyle}>About</Text>
                </Pressable>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)} >
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => this.setModalVisible(!modalVisible)} >
                    <Text style={styles.textStyle}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            
          </Modal>

          <Pressable
            style={styles.button}
            onPress={() => this.setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Settings</Text>
          </Pressable>
          
          <Pressable
            style={styles.button}
            onPress={() => this.paused()}
          >
            <Text style={styles.textStyle}>Pause</Text>
          </Pressable>

        </View>

        <View style={styles.statView}>
          <Text style={styles.stats}>Average Sec/Move {this.state.whiteAve}</Text>
          <Text style={styles.stats}>{this.state.whiteMoves} Moves</Text>
        </View>

        <View
            style={styles.whiteTimer}
          >
          <Pressable onPress={()=>this.whitePressed()}>
            <Text style={styles.timeStyle}>{("0" + this.state.whiteTimeHour).slice (-2)}:{("0" + this.state.whiteTimeMin).slice (-2)}:{("0" + this.state.whiteTimeSec).slice (-2)}</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  blackTimer: {
    flex: 4,
    width: '100%',
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statView: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 10,
  },

  stats:{
    fontSize: 20,
    fontWeight: '600',

  },

  centeredView: {
    flex: 1.5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row'
  },

  whiteTimer: {
    flex: 4,
    width: '100%',
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timeStyle: {
    fontWeight: '700',
    fontSize: 85
  },

  modalView: {
    margin: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  
  modalSubHeader: {
    fontSize: 20,
  },

  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 15,
  },
  
  toLeft: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 15,
    paddingBottom: 15,
  },

  button: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#909090',
    minWidth: 100
  },

  buttonSave: {
    backgroundColor: "#F194FF",
  },

  buttonClose: {
    backgroundColor: "#2196F3",
  },

  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 20
  },

  modalHeader: {
    padding: 5,
    paddingTop: 0,
    textAlign: "center",
    fontSize: 25,
  }

});

export default App;
