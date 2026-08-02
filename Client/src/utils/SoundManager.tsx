// Utils //
import { useEffect } from "react";
import { useSound } from "react-sounds";

// "soundPlayer" object that will contain all the sounds we can play //
let soundPlayer: Record<string, () => void> | null = null;

// Helper function that will be used to create/set the "soundPlayer" object //
// this is required because we cannot access the "soundPlayer" outside of module //
export function setSoundPlayer(player: Record<string, () => void>) {
    soundPlayer = player;
};

// Helper function that will play the sound that will be called //
// this also is required because we cannot access "soundPlayer" outside this module //
export function playSound(type: string) {
    soundPlayer?.[type]?.();
};

// --------------------------------------------------------- //
//         Initializing "soundsPlayer" object                //
// Note; this is required because "useSound" is a react-hook //
//  meaning we must call it inisde a valid react component   //
// --------------------------------------------------------- //

export default function SoundBridge() {
    const info = useSound("notification/popup");
    const success = useSound("notification/success");
    const alert = useSound("notification/error");

    // Initializing Sounds //
    useEffect(() => {
        setSoundPlayer({
            info: () => info.play(),
            success: () => success.play(),
            alert: () => alert.play()
        });
    }, []);
    
    return null;
};