import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import * as yup from 'yup';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().required('Usuario obligatorio'),
	password: yup
		.string()
		.required('Por favor escriba su contraseña.')
		
});

const defaultValues = {
	email: '',
	password: ''
};

function JWTLoginTab(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		setValue('email', '', { shouldDirty: true, shouldValidate: true });
		setValue('password', '', { shouldDirty: true, shouldValidate: true });
	}, [reset, setValue, trigger]);

	useEffect(() => {
		login.errors.forEach(error => {
			setError(error.type, {
				type: 'manual',
				message: error.message
			});
		});
	}, [login.errors, setError]);

	function onSubmit(model) {
		dispatch(submitLogin(model));
	}

	return (
		<div className="w-full">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							type="text"
							error={!!errors.email}
							helperText={errors?.email?.message}
							label="Usuario"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Icon className="text-20" color="action">
											user
										</Icon>
									</InputAdornment>
								)
							}}
							variant="outlined"
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							label="Contraseña"
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							InputProps={{
								className: 'pr-2',
								type: showPassword ? 'text' : 'password',
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											<Icon className="text-20" color="action">
												{showPassword ? 'visibility' : 'visibility_off'}
											</Icon>
										</IconButton>
									</InputAdornment>
								)
							}}
							required
						/>
					)}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16"
					aria-label="LOG IN"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					value="legacy"				
				>
					Ingresar
				</Button>
			</form>

			
		</div>
	);
}

export default JWTLoginTab;
