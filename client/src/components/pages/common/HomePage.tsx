import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-bold text-center mb-6">Ghost Exchange</h1>
            <Card className="w-full min-w-md max-w-[60%] bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome to Ghost Exchange</CardTitle>
                    <ul>
                        <li>RAFANOMEZANTSOA Sandratriniaiaina - ETU002468 - sandratraniaina</li>
                        <li>RAMANANDRAITSIORY Andry Hasin Jean Yves - ETU002539 - hasinajy</li>
                        <li>RAVELONARIVO Sanda Silakiniaina - ETU002510 - Silakiniaina</li>
                        <li>RAKOTONANAHARY Liantsoa Fanantenana Boblith - ETU002611 - Liantsoa123 </li>
                    </ul>
                    <p className="text-2xl bold">Add some styling please:)!!!</p>
                </CardHeader>
            </Card>
        </div>
    );
}