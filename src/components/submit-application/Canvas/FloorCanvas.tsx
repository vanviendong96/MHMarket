import { Box, Collapse, IconButton, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
  rootURL,
} from '../../../const/const';
import Rectangle from './Rectangle';
// import StallDetailDialog from './StallDetailDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';
interface IFloorCanvas {
  floor: any;
}

const currentUser = localStorage.getItem('currentUser')
  ? JSON.parse(localStorage.getItem('currentUser') as string)
  : null;
const token = currentUser?.access_token;

const FloorCanvas: React.FC<IFloorCanvas> = ({ floor }) => {
  const [stalls, setStalls] = useState([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  // const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  // const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  // const [openSuccessDialog, setOpenSuccessDialog] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [image, status] = useImage(floor.image_url ?? '');

  const imageRef = useRef(null);

  useEffect(() => {
    const imgEl = (imageRef.current as any).getAttrs()?.image;
    if (status === 'loaded') {
      setCanvasWidth(imgEl?.width);
      setCanvasHeight(imgEl?.height);
    }
  }, [status]);

  const handleExpand = () => {
    setExpand((prev) => !prev);
    fetch(`${rootURL}/floors/${floor.floorplan_id}/published`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error_code) {
          throw new Error(response.error_description);
        } else {
          console.log(response);
          setStalls(response?.stalls ?? []);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target.getClassName() === 'Image';
    if (clickedOnEmpty) {
      setSelectedId('');
    }
  };

  const handleDoubleClickStall = () => {
    console.log('dbcl');
  };

  return (
    <>
      <Box sx={{ margin: '10px 0' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#5c9090',
            padding: '5px 20px',
          }}>
          <Typography sx={{ fontSize: '18px' }}>{floor.floor_name}</Typography>
          <IconButton onClick={handleExpand} sx={{ padding: '15px' }}>
            <ExpandMoreIcon
              style={expand ? { transform: 'scale(1,-1)' } : {}}
            />
          </IconButton>
        </Box>
        <Collapse in={expand}>
          <Paper elevation={5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#bfd0ca',
                padding: '10px 30px',
              }}>
              <Typography>Number of stalls: {stalls.length}</Typography>
              <Box sx={{ display: 'flex', gap: '40px' }}>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CircleIcon color="error" />
                  Occupied
                </Typography>
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CircleIcon color="success" />
                  Available
                </Typography>
              </Box>
            </Box>
            <div
              style={{
                width: CONTAINER_WIDTH,
                height: CONTAINER_HEIGHT,
                overflow: 'auto',
              }}>
              <Stage
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}>
                <Layer>
                  <Image image={image} ref={imageRef} />
                  {stalls.length > 0 &&
                    stalls.map((stall: any) => (
                      <Rectangle
                        key={stall.stall_id}
                        stall={stall}
                        isSelected={stall.stall_id === selectedId}
                        onSelect={() => {
                          setSelectedId(stall.stall_id);
                        }}
                        onDoubleClickStall={handleDoubleClickStall}
                      />
                    ))}
                </Layer>
              </Stage>
            </div>
          </Paper>
        </Collapse>
      </Box>
      {/* <StallDetailDialog
        stall={rects.find((rect: any) => rect.stall_id === selectedId)}
        openProp={openDetailDialog}
        onCloseDialog={() => setOpenDetailDialog(false)}
        onSubmit={handleEditDetailStall}
      />
      <ConfirmDialog
        openProp={openConfirmDialog}
        message={'Are you sure you wanna delete?'}
        onCloseDialog={() => setOpenConfirmDialog(false)}
        onAcceptDialog={handleDeleteStall}
      />
      <SuccessDialog
        openProp={openSuccessDialog}
        message={'Successfully updated stall metadata'}
        onCloseDialog={() => setOpenSuccessDialog(false)}
      /> */}
    </>
  );
};

export default FloorCanvas;
