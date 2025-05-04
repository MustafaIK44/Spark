import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../libs/firebase/config";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    return NextResponse.json({ message: "Login successful", uid: user.uid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
