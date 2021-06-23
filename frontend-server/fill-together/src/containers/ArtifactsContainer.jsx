import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { isNil } from 'lodash';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import QRCode from 'qrcode.react';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import emptyCellImg from '../assets/default-emptycell.png';
import soldoutImg from '../assets/default-soldout.png';
import ImageGridList from '../components/ImageGridList';
import { fetchCellsByArtifactId } from '../apis/artifacts';
import { getBalance, getOwner } from '../smart-contract/api/UseCaver';
import { buyCell, DEFAULT_QR_CODE } from '../smart-contract/api/UseKlip';
import { getImagePixels } from '../utils/util';

import { yellow } from '@material-ui/core/colors';

const API_URL = 'http://3.37.161.56:8000';
const DEFAULT_ADDR = '0x0000000000000000000000000000000000000000';

export default function ArtifactsContainer(props) {
  const { currentArtifactId, setBoughtCellId, setPreviewInitialized } = props;
  const [gridImages, setGridImages] = useState([]);
  const [cookies] = useCookies([
    'fillTogether_login_type',
    'fillTogether_wallet_addr'
  ]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [qrvalue, setQrvalue] = React.useState(DEFAULT_QR_CODE);
  const [openPurchaseKlip, setOpenPurchaseKlip] = React.useState(false);
  
  const nowTime = new Date();
  const endTime = new Date('6/28/2021');

  const [days, setDays] = React.useState( Math.floor( Math.abs(endTime-nowTime)/(1000*60*60*24) ) );
  const [hours, setHours] = React.useState( Math.floor( Math.abs(endTime-nowTime)/(1000*60*60) ) % 24 );
  const [minutes, setMinutes] = React.useState( Math.floor( Math.abs(endTime-nowTime)/(1000*60) % 60 ) );
  const [seconds, setSeconds] = React.useState( Math.floor( Math.abs(endTime-nowTime)/(1000)  ) % 60 );

  const onImageClick = async (cell) => {
    console.log(`Artifact ID: ${currentArtifactId}, cell ID: ${cell.id}`);
    const walletAddress = cookies.fillTogether_wallet_addr;
    const walletType = cookies.fillTogether_login_type;
    if (walletType !== 'klip') {
      alert('klip 로그인을 해주세요');
      return
    }
    
    const owner = await getOwner(currentArtifactId, cell.id);
    console.log(owner)
    console.log(walletAddress);
    
    switch (cell.status) {
      case 'empty':
        if (owner !== DEFAULT_ADDR) {
          alert('이미 구매된 블록입니다.')
          return
        }
        buyCell(
          currentArtifactId,
          cell.id,
          qrUrl => {
            setOpenPurchaseKlip(true);
            setQrvalue(qrUrl);
            console.log(qrUrl);
          },
          res => {
            setOpenPurchaseKlip(false);
            console.log(`[Result] ${JSON.stringify(res)}`);
            if (res.status === 'success') {
              setBoughtCellId(cell.id);
              alert('구매되었습니다.')
            }
          }
        );
        break
      case 'drawing':
        if (owner === walletAddress) {
          setBoughtCellId(cell.id)  
        }
        break
      case 'completed':
        if (owner === walletAddress) {
            setBoughtCellId(cell.id)

            const bitmap = await getImagePixels(cell.src)
            setPreviewInitialized(true);
            const canvas = document.getElementById('preview');
            const ctx = canvas.getContext('2d');
            for (let i = 0; i < 10; i++) {
              for (let j = 0; j < 10; j++) {
                const pixelId = '0_0_' + i + '_' + j;
                document.getElementById(pixelId).style.backgroundColor = bitmap[i][j];
                ctx.fillStyle = bitmap[i][j];
                ctx.fillRect(j, i, 1, 1);
              }
            }
        }
        break
    }
  };

  useEffect(() => {
    if (currentArtifactId === undefined) return;

    const cells = [];
    const ownerPromise = [];
    for (let i = 0; i < 5 * 5; i++) {
      ownerPromise.push(getOwner(currentArtifactId, i))
    }
    Promise.all(ownerPromise).then((values) => {
      for (let i = 0;i<5*5; i++) {
        let info = {}
        if(values[i] === DEFAULT_ADDR) {
          info = {
            id: `${i}`,
            src: emptyCellImg,
            status: 'empty'
          };
        } else {
          info = {
            id: `${i}`,
            src: soldoutImg,
            status: 'drawing'
          };
        }
        cells.push(info);
      }

      const args = {
        baseDomain: API_URL
      };

      args.artifactId = currentArtifactId;
      return fetchCellsByArtifactId(args)
    }).then(response => {
        response.data.forEach(cell => {
          //cells[cell.cell_id].src = cell.s3_url;
          const urlSplited = cell.s3_url.split('/')
          const key = urlSplited[urlSplited.length-1]
          cells[cell.cell_id].src = `${API_URL}/s3?key=${key}`
          cells[cell.cell_id].status = 'completed'
        });
        setGridImages(cells);
      })
      .catch(err => {
        console.log(err);
      });

    //
    //   axios.get(`${API_URL}/artifacts/`).then(res => {
    //     const artifactsId = res.data[res.data.length - 1].id;
    //     axios.get(`${API_URL}/artifacts/${artifactsId}/cells`).then(response => {
    //       response.data.forEach(cell => {
    //         cells[cell.cell_id].src = cell.s3_url;
    //       });
    //       setGridImages(cells);
    //     });
    //   });
  }, [currentArtifactId]);

  useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }

            if (parseInt(seconds) === 0) {
                if (parseInt(minutes) === 0) {
                    if (parseInt(hours) === 0) {
                        if (parseInt(days) === 0) {
                            clearInterval(countdown);
                        } else {
                            setDays(parseInt(days) - 1);
                            setHours(23);
                            setMinutes(59);
                            setSeconds(59);
                        }
                    } else {
                        setHours(parseInt(hours) - 1);
                        setMinutes(59);
                        setSeconds(59);
                    }
                } else {
                    setMinutes(parseInt(minutes) - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return () => clearInterval(countdown);
    }, [days, hours, minutes, seconds]);

  return (
    <div>
      <center>
        <p style={{fontSize: '16px', color: "black"}}>
            <u>Remaining Time of <b>1st work</b></u>
        </p>
        <table style={{textAlign: 'center', borderSpacing: '20px 0'}}>
            <thead style={{backgroundColor: 'white', fontSize: '40px', color: 'red', textShadow: '4px 4px 4px rgba(255,0,0,0.4)'}}>
                <tr>
                    <th style={{width: '80px', border: '1px solid gray'}}>{days}</th>
                    <th style={{width: '80px', border: '1px solid gray'}}>{hours}</th>
                    <th style={{width: '80px', border: '1px solid gray'}}>{minutes}</th>
                    <th style={{width: '80px', border: '1px solid gray'}}>{seconds}</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{color: 'gray'}}>
                    <td>Days</td>
                    <td>Hours</td>
                    <td>Minutes</td>
                    <td>Seconds</td>
                </tr>
            </tbody>
        </table>
      </center>
      <br/>
      <ImageGridList data={gridImages} imgClick={onImageClick} />
      <Dialog
        fullScreen={fullScreen}
        open={openPurchaseKlip}
        onClose={() => setOpenPurchaseKlip(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <center>
          Purchase cell via Kakao Klip QR Code <br/> (0.01 KLAY per grid)
          </center>
        </DialogTitle>
        <DialogContent style={{backgroundColor: yellow[500]}}>
          <center>
          <QRCode value={qrvalue} />
          </center>
        </DialogContent>
      </Dialog>
    </div>
  );
}
