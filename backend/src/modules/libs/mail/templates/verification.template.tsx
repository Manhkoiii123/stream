/* eslint-disable prettier/prettier */
import * as React from 'react'
import { Body } from '@react-email/body'
import { Button } from '@react-email/button'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Hr } from '@react-email/hr'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'

interface VerificationTemplateProps {
	domain: string
	token: string
}

export function VerificationTemplate({
	domain,
	token
}: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html >
			<Head />
			<Preview>Verify your Stream account</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					{/* Logo / Brand */}
					<Section style={styles.logoSection}>
						<Heading style={styles.brand}>🎬 Stream</Heading>
					</Section>

					<Hr style={styles.hr} />

					{/* Main content */}
					<Section style={styles.content}>
						<Heading as='h2' style={styles.heading}>
							Confirm your email address
						</Heading>
						<Text style={styles.text}>
							Thanks for signing up! Please verify your email address to
							activate your account and start using Stream.
						</Text>
						<Text style={styles.text}>
							Click the button below to confirm your email. This link will
							expire in <strong>15 minutes</strong>.
						</Text>

						<Section style={styles.buttonWrapper}>
							<Button href={verificationLink} style={styles.button}>
								Verify Email Address
							</Button>
						</Section>

						<Text style={styles.smallText}>
							Or copy and paste this URL into your browser:
						</Text>
						<Text style={styles.link}>{verificationLink}</Text>
					</Section>

					<Hr style={styles.hr} />

					{/* Footer */}
					<Section style={styles.footer}>
						<Text style={styles.footerText}>
							If you didn't create an account with Stream, you can safely
							ignore this email.
						</Text>
						<Text style={styles.footerText}>
							© {new Date().getFullYear()} Stream. All rights reserved.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	)
}

const styles: Record<string, React.CSSProperties> = {
	body: {
		backgroundColor: '#0f0f0f',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		margin: 0,
		padding: 0
	},
	container: {
		maxWidth: '560px',
		margin: '40px auto',
		backgroundColor: '#1a1a1a',
		borderRadius: '12px',
		overflow: 'hidden',
		border: '1px solid #2a2a2a'
	},
	logoSection: {
		padding: '32px 40px 20px'
	},
	brand: {
		fontSize: '24px',
		fontWeight: '700',
		color: '#e50914',
		margin: 0
	},
	hr: {
		borderColor: '#2a2a2a',
		margin: 0
	},
	content: {
		padding: '32px 40px'
	},
	heading: {
		fontSize: '22px',
		fontWeight: '700',
		color: '#ffffff',
		margin: '0 0 16px'
	},
	text: {
		fontSize: '15px',
		lineHeight: '1.6',
		color: '#a0a0a0',
		margin: '0 0 16px'
	},
	buttonWrapper: {
		textAlign: 'center' as const,
		margin: '28px 0'
	},
	button: {
		backgroundColor: '#e50914',
		color: '#ffffff',
		fontSize: '15px',
		fontWeight: '600',
		textDecoration: 'none',
		padding: '14px 32px',
		borderRadius: '8px',
		display: 'inline-block'
	},
	smallText: {
		fontSize: '13px',
		color: '#666666',
		margin: '0 0 6px'
	},
	link: {
		fontSize: '13px',
		color: '#e50914',
		wordBreak: 'break-all' as const,
		margin: 0
	},
	footer: {
		padding: '24px 40px 32px'
	},
	footerText: {
		fontSize: '12px',
		color: '#555555',
		margin: '0 0 6px',
		lineHeight: '1.5'
	}
}