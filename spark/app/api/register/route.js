import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../libs/firebase/config";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    return NextResponse.json({ message: "User created", uid: user.uid }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
