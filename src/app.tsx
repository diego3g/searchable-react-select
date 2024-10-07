import { Controller, useForm } from 'react-hook-form'
import { SelectUser } from './select-user'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

type FormSchema = z.infer<typeof formSchema>

export function App() {
  const { handleSubmit, control } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  function handleSave(data: FormSchema) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleSave)} className="h-screen flex flex-col gap-6 items-center justify-center">
      <Controller 
        control={control}
        name="user"
        render={({ field }) => {
          return (
            <SelectUser value={field.value} onValueChange={field.onChange} />
          )
        }}
      />

      <button type="submit">Salvar</button>
    </form>
  )
}
