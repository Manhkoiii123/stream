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

interface AccountDeletionTemplateProps {
    domain: string
}

export function AccountDeletionTemplate({domain} : AccountDeletionTemplateProps) {
    const registerLink = `${domain}/account/create`
	return (
		<Html>
			<Head />
			<Preview>Your Stream account has been permanently deleted</Preview>
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
							Your account has been deleted
						</Heading>
						<Text style={styles.text}>
							We're confirming that your Stream account has been
							permanently deleted. All your data, including your profile,
							watch history, and settings, have been removed from our
							systems.
						</Text>
						<Text style={styles.text}>
							This action is <strong>irreversible</strong>. If you'd like
							to use Stream again in the future, you're always welcome to
							create a new account.
						</Text>
						<Text style={styles.text}>
							Thank you for being part of the Stream community. We hope to
							see you again someday.
						</Text>

						<Section style={styles.buttonWrapper}>
							<Button href={registerLink} style={styles.button}>
								Create a New Account
							</Button>
						</Section>
					</Section>

					<Hr style={styles.hr} />

					{/* Footer */}
					<Section style={styles.footer}>
						<Text style={styles.footerText}>
							If you did not request account deletion, please contact our
							support team immediately.
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
