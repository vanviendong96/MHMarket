import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface INestedList {
  title: string;
  icon: React.ReactNode;
  nestedList: any;
  toggleDrawer: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const NestedList: React.FC<INestedList> = ({
  title,
  icon,
  nestedList,
  toggleDrawer,
}) => {
  const [openCollapse, setOpenCollapse] = useState<boolean>(false);

  return (
    <ListItem disablePadding sx={{ display: 'list-item' }}>
      <ListItemButton
        onClick={() => setOpenCollapse(!openCollapse)}
        sx={{ ':hover': { backgroundColor: '#d93939' } }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
        {openCollapse ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openCollapse}>
        <List component="div" disablePadding>
          {nestedList
            .filter((link: any) => link?.isPublic)
            .map((link: any, index: number) => (
              <ListItem
                key={index}
                disablePadding
                sx={{ ':hover': { backgroundColor: '#d93939' } }}
                onClick={toggleDrawer}>
                <Link
                  to={link.url}
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    width: '100%',
                  }}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </ListItem>
  );
};

export default NestedList;
