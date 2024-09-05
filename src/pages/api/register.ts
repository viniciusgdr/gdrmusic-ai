import prismaClient from '@gdrmusic/db/prismaClient';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (
    req.method !== 'POST'
  ) {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Senha deve ter no mínimo 8 caracteres.' })
    return
  }
  if (!validator.isLength(password, { min: 8, max: 30 })) {
    res.status(400).json({ error: 'Senha deve ter no máximo 30 caracteres.' })
    return
  }
  if (!password.match(/[A-Z]/g)) {
    res.status(400).json({ error: 'Senha deve ter no mínimo uma letra maiúscula.' })
    return
  }
  if (!password.match(/[a-z]/g)) {
    res.status(400).json({ error: 'Senha deve ter no mínimo uma letra minúscula.' })
    return
  }
  if (!password.match(/[0-9]/g)) {
    res.status(400).json({ error: 'Senha deve ter no mínimo um número.' })
    return
  }
  
  const isEmail = validator.isEmail(email)
  if (!isEmail) {
    res.status(400).json({ error: 'Email inválido.' })
    return
  }
  const user = await prismaClient.user.findUnique({
    where: {
      email
    }
  })
  if (user) {
    res.status(400).json({ error: 'Email já registrado.' })
    return
  }
  const hashedPassword = await bcrypt.hash(password, 12)
  await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      name: '',
      accountMethod: 'EMAIL',
      userId: Math.random().toString(36).substring(7)
    }
  })
  res.status(200).json({
    message: 'User created',
  })
}