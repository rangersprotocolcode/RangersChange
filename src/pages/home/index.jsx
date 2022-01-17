import React, {useState, useEffect,useCallback } from 'react';
import {Input,message,Modal,Table,Button} from 'antd';
import {getAddress,addressChannge} from '@/utils/tool'
import {connect} from 'dva';
import styles from './index.less';

const { Search } = Input;
const ethereum = window.ethereum;
const path = 'wss://mainnet.rangersprotocol.com/api/writer';
const websocket = new WebSocket(path);

function Index(props) {
  const {dispatch} = props;
  const [address,setAddress] = useState();
  const [newAddr,setNewAddr] = useState('');
  const [miner,setMiner] = useState([]);
  const [minerID,setMinerID] = useState();
  const [time,setTime] = useState();

  const getMinerList = addr => {
    dispatch({
      type: 'home/queryMiner'
    }).then(res => {
      if(res){
        res.forEach(value => {
          value['key'] = value.id;
          if(addr == value.account){
            setMinerID(value.id);
          }
        })
        setMiner(res)
      }
    })
    const time = setTimeout(() => {
      getMinerList(addr);
    },1000 * 10);
    setTime(time);
  }

  console.log(miner)

  const onSearch = () => {
    let reg = /^(0x)?[0-9a-fA-F]{40}$/;
    if(!newAddr)return;
    if(!minerID){
      message.error("Can't find the minerID.");
      return;
    }
    if(!reg.test(newAddr)){
      message.error('invalid address');
      return;
    }
    if(miner.filter(value => value.account == newAddr).length > 0){
      message.warning(newAddr + ' ' + 'is a miner already');
      return;
    }
    const userAddr = newAddr.trim();
    if(address){
      dispatch({
        type: 'home/queryAccounttx',
        payload: {
          'old': address,
          'new': userAddr
        }
      }).then(res => {
        if(res){
          // console.log(res)
          ethereum.request({
            jsonrpc: '2.0',
            method: 'eth_sign',
            id: '1',
            params: [address,res.hash]
          }).then(result => {
            if(result){
              res['sign'] = result;
              // console.log(res)
              if(websocket.readyState == 1){
                websocket.send(JSON.stringify(res));
                Modal.success({
                  title: 'Changed successful!'
                });
                // websocket.onmessage = function(res) {
                //   console.log(res)
                // }
              }
            }
          })
        }
      })
    }else{
      getAddress(res => {
        setAddress(res[0]);
      })
    }
  }

  const columns = [{
    title: 'Address',
    dataIndex: 'account',
    key: 'account',
  },{
    title: 'Miner ID',
    dataIndex: 'id',
    key: 'id',
  }]

  useEffect(() => {
    if (typeof window.ethereum == 'undefined') {
      Modal.warning({
        title: 'MetaMask is not installed!'
      });
    }
    getAddress(res => {
      setAddress(res[0])
    })
    addressChannge(res => {
      setAddress(res[0]);
      getMinerList(res[0]);
    })
    websocket.onopen = () => {
      console.log("Websoclet connection succeeded");
    }
    websocket.onerror = function() {
      console.log("Websoclet connection failed");
    }
  },[]);

  useEffect(() => {
    if(address){
      getMinerList(address);
    }

    return () => {
      clearTimeout(time);
    }
  },[address])

  return (
    <div className={styles.home}>
      <div className={styles.income}>
        <h1>Income Account</h1>
        <div className={styles.address}>
          <ul>
            <li> <span>Address:</span> {address}</li>
            <li> <span>Miner ID:</span> {minerID} </li>
          </ul>
          <div className={styles.inputSty}>
            <Input bordered={false} placeholder="input your address" onChange={e => setNewAddr(e.target.value)}/>
            <Button type='primary' onClick={onSearch}>确定</Button>
          </div>
        </div>
        <div className={styles.myTable}>
          <Table columns={columns} dataSource={miner} pagination={false}/>
        </div>
      </div>
    </div>
  );
}
export default connect(({home:{}}) => ({}))(Index);
