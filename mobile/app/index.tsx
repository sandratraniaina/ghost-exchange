
import { Activity, Airplay } from '@tamagui/lucide-icons';
import { Button, XGroup, XStack, YStack } from 'tamagui';

import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from "@tamagui/config/v4";

const config = createTamagui(defaultConfig);

export function ButtonDemo() {
    return (
        <YStack padding="$3" gap="$3" >
            <Button>Plain</Button>
            <Button alignSelf="center" icon={Airplay} size="$6">
                Large
            </Button>
            <XStack gap="$2" justifyContent="center">
                <Button size="$3" theme="active">
                    Active
                </Button>
                <Button size="$3" variant="outlined">
                    Outlined
                </Button>
            </XStack>
            <XStack gap="$2">
                <Button themeInverse size="$3">
                    Inverse
                </Button>
                <Button iconAfter={Activity} size="$3">
                    iconAfter
                </Button>
            </XStack>
            <XGroup>
                <XGroup.Item>
                    <Button width="50%" size="$2" disabled opacity={0.5}>
                        disabled
                    </Button>
                </XGroup.Item>

                <XGroup.Item>
                    <Button width="50%" size="$2" chromeless>
                        chromeless
                    </Button>
                </XGroup.Item>
            </XGroup>
        </YStack>
    )
}

export default function Index() {
    return (
        <TamaguiProvider config={config}>
            <ButtonDemo></ButtonDemo>
        </TamaguiProvider>
    );
}
