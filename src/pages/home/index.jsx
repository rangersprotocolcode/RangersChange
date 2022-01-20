import React, {useState, useEffect } from 'react';
import {Input,message,Modal,Table,Button} from 'antd';
import {getAddress,addressChannge,getBalance,walletChainAdd,getCurChain,chainChange} from '@/utils/tool'
import {connect} from 'dva';
import styles from './index.less';

const ethereum = window.ethereum;
const pathMain = 'wss://mainnet.rangersprotocol.com/api/writer';
const pathDev = 'ws://192.168.2.19/api/writer';
const path = process.env.chainNet == 'prod' ? pathMain : pathDev;
const websocket = new WebSocket(path);

function Index(props) {
  const {dispatch} = props;
  const [address,setAddress] = useState();
  const [newAddr,setNewAddr] = useState('');
  const [miner,setMiner] = useState([]);
  const [minerID,setMinerID] = useState();
  const [balance,setBalance] = useState(0);

  const reg = /^(0x)?[0-9a-fA-F]{40}$/;

  const getMinerList = addr => {
    dispatch({
      type: 'home/queryMiner'
    }).then(res => {
      if(res){
        const minerList = res.filter(value => value.account == addr);
        if(minerList.length > 0){
          setMinerID(minerList[0].id);
        }else{
          setMinerID('');
        }
        res.forEach(value => {
          value['key'] = value.id;
        })
        setMiner(res);
      }
    })
  }

  const getUserBalance = address => {
    getBalance(address,res => {
      const v = parseInt(res,16) / Math.pow(10,18);
      setBalance(v);
    })
  }

  const onSearch = () => {
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
      message.warning(newAddr + ' ' + 'is already a miner.');
      return;
    }

    if(balance < 0.0001){
      Modal.warning({
        title: 'Insufficient funds.'
      });
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
                setNewAddr('');
                getMinerList(address);
                
                websocket.onmessage = function(res) {
                  const data = res.data && JSON.parse(res.data);
                  if(data.status == 0){
                    Modal.success({
                      title: 'Changed successful!'
                    });
                  }
                }
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
    const mainCode = process.env.chainNet == 'prod' ? '0x7e9' : '0x251c';
    if(typeof window.ethereum == 'undefined') {
      Modal.warning({
        title: 'MetaMask is not installed!'
      });
    }else{
      getAddress(addrList => {
        const addr = addrList[0];
        setAddress(addr);
        getCurChain(res => {
          if(res != mainCode){
            walletChainAdd(val => {
              getUserBalance(addr);
              getMinerList(addr);
            })
          }else{
            getUserBalance(addr);
            getMinerList(addr);
          }
        })
      })
    }
    
    addressChannge(res => {
      const addr = res[0];
      setAddress(addr);
      getMinerList(addr);
      getUserBalance(addr);
    })

    chainChange(res => {
      if(res == mainCode){
        getAddress(addr => {
          getUserBalance(addr[0]);
        });
      }else{
        setBalance(0);
      }
    })
    websocket.onopen = () => {
      console.log("Websoclet connection succeeded");
    }
    websocket.onerror = function() {
      console.log("Websoclet connection failed");
    }

    let timer = setInterval(() => {
      getAddress(res => {
        getMinerList(res[0]);
      })
    },1000 * 10)

    return () => {
      clearInterval(timer);
    }
  },[]);

  

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
            <Input bordered={false} placeholder="input your address" value={newAddr} onChange={e => setNewAddr(e.target.value)}/>
            <Button type='primary' disabled={!(reg.test(newAddr) && minerID)} onClick={onSearch}>确定</Button>
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
