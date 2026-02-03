import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthCodeError() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-stone-50 p-4">
            <Card className="max-w-md w-full border-red-200 shadow-sm">
                <CardHeader className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-red-900">Authentication Failed</CardTitle>
                    <CardDescription>
                        We couldn't verify your login request.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-md text-sm text-red-800">
                        <p>This can happen if:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                            <li>The link has expired.</li>
                            <li>The link has already been used.</li>
                            <li>Your browser configuration blocked the request.</li>
                        </ul>
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button className="w-full">Back to Login</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
