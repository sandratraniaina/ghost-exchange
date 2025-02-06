import { createTamagui, TamaguiProvider, View } from 'tamagui';
import { defaultConfig } from "@tamagui/config/v4";
import { Stack } from 'expo-router';

const config = createTamagui(defaultConfig);

export default () => (
	<TamaguiProvider config={config}>
		<Stack />
	</TamaguiProvider>
)