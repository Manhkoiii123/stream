/* eslint-disable prettier/prettier */
import * as React from 'react'
import { Body } from '@react-email/body'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Hr } from '@react-email/hr'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import { Link } from '@react-email/link'

interface EnableTwoFactorTemplateProps {
	domain: string
}

export function EnableTwoFactorTemplate({ domain }: EnableTwoFactorTemplateProps) {
	const settingLink = `${domain}/dashboard/settings`
	return (
		<Html>
			<Head />
			<Preview>Your two-factor authentication code</Preview>
			<Body style={styles.body}>
				<Container style={styles.container}>
					<Section style={styles.logoSection}>
						<Heading style={styles.brand}>🎬 Stream</Heading>
					</Section>

					<Hr style={styles.hr} />

					<Section style={styles.content}>
						<Heading as='h2' style={styles.heading}>
							Two-Factor Authentication
						</Heading>
						<Text style={styles.text}>
							You have requested to enable two-factor authentication on your
							Stream account. Use the verification code below to complete the
							setup.
						</Text>
						<Text style={styles.text}>
							This code will expire in <strong>15 minutes</strong>. Do not
							share it with anyone.
						</Text>

						<Section style={styles.codeWrapper}>
							<Text style={styles.codeLabel}>Your verification code</Text>
						<Link href={settingLink} style={styles.code}>{settingLink}</Link>
						</Section>

						<Text style={styles.smallText}>
							Enter this code in the Stream app to complete 2FA setup.
						</Text>
					</Section>

					<Hr style={styles.hr} />

					<Section style={styles.footer}>
						<Text style={styles.footerText}>
							If you did not request this, please ignore this email or contact
							support if you have concerns about your account security.
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
	codeWrapper: {
		backgroundColor: '#111111',
		border: '1px solid #2a2a2a',
		borderRadius: '10px',
		padding: '24px',
		textAlign: 'center' as const,
		margin: '28px 0'
	},
	codeLabel: {
		fontSize: '12px',
		color: '#666666',
		textTransform: 'uppercase' as const,
		letterSpacing: '1.5px',
		margin: '0 0 12px'
	},
	code: {
		fontSize: '36px',
		fontWeight: '700',
		color: '#e50914',
		letterSpacing: '8px',
		margin: 0,
		fontFamily: '"Courier New", Courier, monospace'
	},
	smallText: {
		fontSize: '13px',
		color: '#666666',
		margin: '0 0 6px'
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
