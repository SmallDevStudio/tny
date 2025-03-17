 import { Avatar } from "@mui/material";

export default function UserAvatar({ user, size }) {
    return (
        <Avatar
            alt={user?.name}
            src={user?.picture}
            sx={{ 
                width: size, 
                height: size 
            }}
        />
    );
}